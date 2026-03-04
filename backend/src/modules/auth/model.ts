import { Elysia , t } from 'elysia'

// Schemas

const Signup = t.Object({
    email: t.String(),
    password: t.String(),
    full_name: t.String()
})

const Login = t.Object({
    email: t.String(),
    password: t.String()
})

export const authModel = new Elysia()
    .model({
        "auth.login": Login,
        "auth.signup": Signup
    })