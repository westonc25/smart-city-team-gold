import { t } from 'elysia'
import { type UnwrapSchema } from 'elysia'

// Schemas

export const ForumModel = {
    createPost: t.Object({
        jti: t.String(),
        title: t.String(),
        content: t.String(),
        location_name: t.Optional(t.String()),
        category: t.Optional(t.String()),
    }),
    createComment: t.Object({
        post_id: t.Number(),
        jti: t.String(),
        content: t.String(),
    })
} as const

export namespace ForumModel {
    export type createPost = UnwrapSchema<typeof ForumModel.createPost>
    export type createComment = UnwrapSchema<typeof ForumModel.createComment>
}
