import { Elysia } from "elysia";
import "./db";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
// import { forumRoutes } from "./routes/forum";
// import { locationRoutes } from "./routes/locations";
// import { notificationRoutes } from "./routes/notifications";

const app = new Elysia()
  .get("/", () => "Smart City API")
  .use(authRoutes)
  .use(userRoutes)

  /*
  .use(forumRoutes)
  .use(locationRoutes)
  .use(notificationRoutes)
  */

  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
