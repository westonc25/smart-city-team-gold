import { t } from 'elysia'
import { type UnwrapSchema } from 'elysia'

// Schemas

export const ForumModel = {
    createPost: t.Object({
        user_id: t.Number(),
        title: t.String(),
        content: t.String(),
        latitude: t.Optional(t.Number()),
        longitude: t.Optional(t.Number()),
        location_name: t.Optional(t.String()),
        category: t.Optional(t.String()),
    }),
    createComment: t.Object({
        user_id: t.Number(),
        content: t.String(),
    })
} as const

export namespace ForumModel {
    export type createPost = UnwrapSchema<typeof ForumModel.createPost>
    export type createComment = UnwrapSchema<typeof ForumModel.createComment>
}
