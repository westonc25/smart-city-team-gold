import { status } from 'elysia'
import { db } from "../../db";

import { UserModel } from './model'

export abstract class UserService {

    // Get a single user
    // Selects all information about a user using * and stores it in a variable called row.
    // No user found throws a 404 error
    static async getUser({id}: UserModel.getUser){
        
        const [row] = await db`
        SELECT *
        FROM users
        WHERE userID = ${id}
        LIMIT 1`;

        if (!row) throw status (404, "User not found");

        return row;
    }

    // Update user in database
    // Returns the user back for frontend to use
    static async updateUser(id: number, { first_name, last_name, email, profile_picture, password }: UserModel.updateUser) {

        // Hash the new password if one was provided
        const password_hash = password ? await Bun.password.hash(password) : undefined;

        // Updates the user in the database
        // Uses COALESCE so only fields that are provided get updated
        await db`
        UPDATE users
        SET
            first_name = COALESCE(${first_name ?? null}, first_name),
            last_name = COALESCE(${last_name ?? null}, last_name),
            email = COALESCE(${email ?? null}, email),
            profile_picture = COALESCE(${profile_picture ?? null}, profile_picture),
            password_hash = COALESCE(${password_hash ?? null}, password_hash),
            updated_at = NOW()
        WHERE userID = ${id}
        `;

        // Return the updated user information
        const [updated] = await db`
        SELECT *
        FROM users
        WHERE userID = ${id}
        LIMIT 1`;

        if (!updated) throw status(404, "User not found");
        return updated;

    }

    // Get all users

    // Delete a user
    static async deleteUser({id}: UserModel.deleteUser){
        
        const [user] = await db`
        SELECT userID FROM users
        WHERE userID = ${id}
        LIMIT 1`;
        
        if (!user) throw status (404, "User not found");
        
        await db`
        DELETE FROM users
        WHERE userID = ${id}
        `;

        

        return user;
    }

}