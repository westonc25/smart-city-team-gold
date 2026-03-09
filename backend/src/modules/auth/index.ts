import { Elysia } from 'elysia'

import { AuthModel } from "./model";
import { AuthService } from "./service";

export const auth = new Elysia({prefix: '/auth'})

    // Have a user sign up for the app and send their credentials to the database

    .post('/signup', ({ body }) => AuthService.signup(body), { body: AuthModel.signUpBody })

    // Have a user login to the app and send their credentials to the database

    .post('/login', ({ body }) => AuthService.login(body), { body: AuthModel.loginBody })




