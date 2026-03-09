import { Elysia , t } from 'elysia'

import { type UnwrapSchema } from 'elysia'

// Schemas

// ELysia Example Modified

export const AuthModel = {
  loginBody: t.Object({
    email: t.String(),
    password: t.String()
  }),
  signUpBody: t.Object({
    email: t.String(),
    password: t.String(),
    first_name: t.String(),
    last_name: t.String(),
    // profile_picture: t.Optional(t.Blob())
  })
} as const

export namespace AuthModel {
  export type loginBody = UnwrapSchema<typeof AuthModel.loginBody>
  export type signUpBody = UnwrapSchema<typeof AuthModel.signUpBody>
}
