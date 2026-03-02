import { Elysia, t } from "elysia";
import { login, signup } from "../controllers/auth";

export const authRoutes = new Elysia({ prefix: "/auth"})

    // Have a user login to the app and send their credentials to the database

    .post("/login", login, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        })
    })

    // Have a user sign up for the app and send their credentials to the database

    .post("/signup", signup, {
        body: t.Object({
            email: t.String(),
            password: t.String(), 
            full_name: t.String(),
        })
    })