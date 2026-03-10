import { Elysia, status } from 'elysia'
import { jwt } from '@elysiajs/jwt'

import { AuthService } from './service'

// This plugin will handle security when accessing a protected route ie. Forums, Users, Notifications
export const authMiddleware = new Elysia({ name: 'auth-middleware' })

    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
    }))

    .derive({ as: 'scoped' }, async ({ jwt, headers }) => {

        // Do you have a token?
        const token = headers.authorization?.replace('Bearer ', '')
        if (!token) throw status(401, 'Unauthorized')

        // Is the token legitimate?
        const payload = await jwt.verify(token)
        if (!payload?.jti || !payload?.sub) throw status(401, 'Invalid token')

        // Is the session still active? 
        const isValid = await AuthService.validateSession(payload.jti as string)
        if (!isValid) throw status(401, 'Session expired or invalid')

        return {
            user: {
                id: Number(payload.sub),
                email: payload.email as string,
            }
        }
    })
