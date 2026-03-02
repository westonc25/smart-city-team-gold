import { Elysia, t } from "elysia";
import { getUser, updateUser } from "../controllers/users";

export const userRoutes = new Elysia({ prefix: "/users"})

    // Get the user from the database given an ID

    .get("/:id", getUser)

    // Given the user ID, update the users information

    .put("/:id", updateUser, {
        body: t.Object({
            full_name: t.Optional(t.String()),
            email: t.Optional(t.String()),
        })
    })