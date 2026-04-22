import { t } from 'elysia'
import { type UnwrapSchema } from 'elysia'

// Schemas

export const ForumModel = {
    createPost: t.Object({
        title: t.String(),
        content: t.String(),
        location_name: t.Optional(t.String()),
        category: t.Optional(t.String()),
    }),
    createComment: t.Object({
<<<<<<< HEAD
        post_id: t.Number(),
        jti: t.String(),
=======
>>>>>>> b97b3ac (finished implementing forum and map in the backend, connected forum to the frontend and fixed some minor bugs.)
        content: t.String(),
    })
} as const

export namespace ForumModel {
    export type createPost = UnwrapSchema<typeof ForumModel.createPost>
    export type createComment = UnwrapSchema<typeof ForumModel.createComment>
}
