import { t } from 'elysia'
import { type UnwrapSchema } from 'elysia'

// Schemas

export const UserModel = {
    updateUser: t.Object({
        first_name: t.Optional(t.String()),
        last_name: t.Optional(t.String()),
        email: t.Optional(t.String()),
        // profile_picture: t.Optional(t.File()),
        password: t.Optional(t.String())
    })
} as const

export namespace UserModel {
    export type updateUser = UnwrapSchema<typeof UserModel.updateUser>
}
