import { Elysia, status } from 'elysia'
import { jwt } from '@elysiajs/jwt'

import { AuthModel } from "./model";
import { AuthService } from "./service";

const TOKEN_EXPIRY_HOURS = 1;

export const auth = new Elysia({prefix: '/auth'})

    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
    }))

    // Have a user sign up for the app and send their credentials to the database

    .post('/signup', ({ body }) => AuthService.signup(body), { body: AuthModel.signUpBody })

    // Validate credentials, issue a JWT, and store the session

    .post('/login', async ({ body, jwt }) => {
        const user = await AuthService.login(body)

        // Generates a unique ID for this specific login session
        const jti = crypto.randomUUID()

        // Calculates when the token should expire 
        const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

        // Create the JWT
        const token = await jwt.sign({ sub: String(user.id), email: user.email, jti, exp: Math.floor(expiresAt.getTime() / 1000) })
       
        // Save the session to the database so we can invalidate it on logout
        await AuthService.createSession(user.id, jti, expiresAt)

        // Token sent back to the client for them to use
        return { token }
    }, { body: AuthModel.loginBody })

    // Invalidate the session so the token can no longer be used

    .post('/logout', async ({ jwt, headers }) => {
         // Do you have a token?
        const token = headers.authorization?.replace('Bearer ', '')
        if (!token) throw status(401, 'Unauthorized')
        
         // Is the token legitimate?
        const payload = await jwt.verify(token)
        if (!payload?.jti) throw status(401, 'Invalid token')

        await AuthService.deleteSession(payload.jti as string)
        return { success: true }
    })




