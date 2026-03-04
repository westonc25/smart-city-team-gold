import { Elysia , t} from 'elysia'

// Schemas

const createPost = t.Object({
     user_id: t.Number(),
     title: t.String(),
     content: t.String(),
     latitude: t.Optional(t.Number()),
     longitude: t.Optional(t.Number()),
     location_name: t.Optional(t.String()),
     category: t.Optional(t.String()),
})

const createComment = t.Object({
    user_id: t.Number(),
    content: t.String(),
})

export const forumModel = new Elysia()
    .model({
        'forum.createPost': createPost,
        'forum.createComment': createComment
    })