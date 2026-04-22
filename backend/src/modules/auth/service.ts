import type { AuthModel } from './model'
import { status } from 'elysia'
import { db } from "../../db";

export abstract class AuthService {
    // Login
    static async login({ email , password }: AuthModel.loginBody) {
        // Look up the user by email
        const [user] = await db`
        SELECT userID, email, password_hash
        FROM users
        WHERE email = ${email}
        LIMIT 1
        `;

        // Check if user exists
        if (!user) throw status(401, 'Invalid credentials')

        // Check if the password matches
        const passwordMatch = await Bun.password.verify(password, user.password_hash)
        if (!passwordMatch) throw status(401, 'Invalid credentials')

        return { id: user.userID, email: user.email };
    }

    // Create a session row after successful login
    static async createSession(userId: number, jti: string, expiresAt: Date) {
        await db`
        INSERT INTO sessions (user_id, jti, expires_at)
        VALUES (${userId}, ${jti}, ${expiresAt})
        `;
    }

    // Delete a session on logout
    static async deleteSession(jti: string) {
        await db`DELETE FROM sessions WHERE jti = ${jti}`;
    }

    // Check the session still exists and hasn't expired
    static async validateSession(jti: string): Promise<boolean> {
        const [session] = await db`
        SELECT id FROM sessions
        WHERE jti = ${jti} AND expires_at > NOW()
        LIMIT 1
        `;
        return !!session;
    }

    // Signup
    static async signup({email, password, first_name, last_name}: AuthModel.signUpBody){
        // Check if the email already exists in the database
        const existing = await db`
        SELECT email 
        FROM users 
        WHERE email = ${email}`;
        
        // If it does, reject the email
        if (existing.length) return new Response("Email already in use", { status: 409 });
        
        // Hash the password before inserting
        const hashedPassword = await Bun.password.hash(password);

        // If not, insert new user into database
        try {
            await db`
            INSERT INTO users (email, password_hash, first_name, last_name, created_at, updated_at, is_active, auth_provider)
            VALUES (${email}, ${hashedPassword}, ${first_name}, ${last_name}, NOW(), NOW(), 1, 'local')
            `;
        } catch {
            throw status(500, 'Signup failed. Please try again.');
        }

        return { success: true };
    
    }

    // Get location by session token
    static async getSessionWithLocation(jti: string) {
        const [session] = await db`
            SELECT 
                s.sessions_id,
                s.user_id,
                cl.geo_point
            FROM sessions s
            JOIN current_location cl ON s.location_id = cl.current_location_id
            WHERE s.jti = ${jti}
            AND s.expires_at > NOW()
    `;

    return session ?? null;
}
}
