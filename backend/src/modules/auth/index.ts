import { Elysia } from 'elysia'

import { authModel } from "./model";
// Import Services when implemented

export const auth = new Elysia({prefix: '/auth'})
    .use(authModel)

    // Have a user sign up for the app and send their credentials to the database

    .post('/signup', ()=> 'Route Accessed', { body: 'auth.signup' })
    
    // Have a user login to the app and send their credentials to the database

    .post('/login', ()=> 'Route Accessed', { body: 'auth.login' })

    // Delete a user profile from the app




