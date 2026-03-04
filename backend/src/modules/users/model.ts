import { Elysia , t } from 'elysia'

// Schemas

const updateUser = t.Object({
    full_name: t.Optional(t.String()),
    email: t.Optional(t.String())
})

export const userModel = new Elysia()
    .model({ 
        "users.updateUser": updateUser
     })