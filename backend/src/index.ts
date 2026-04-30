import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'
import "./db";
import { auth } from "./modules/auth";
import { users } from "./modules/users";
import { forum } from "./modules/forum";
import { map } from "./modules/map";
// import { notifications } from "./modules/notifications";

const app = new Elysia()
  .use(swagger())

  .get("/", () => "Smart City API")
  .use(auth)
  .use(users)
  .use(forum)
  .use(map)

  .listen({ port: 3000, hostname: '0.0.0.0' });

console.log(` SmartCity server is running at ${app.server?.hostname}:${app.server?.port}`);
