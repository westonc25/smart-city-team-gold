import { db } from "../db";

export const login = async ({ body }: { body: { email: string; password: string; } }) => {
    // Look up the user by email
    const users = await db`
    SELECT userID, email, full_name, password_hash, is_active
    FROM users
    WHERE email = ${body.email} AND is_active = 1
  `;

  // If no user is found then reject the request
  if (!users.length) return new Response("Invalid credentials", { status: 401 });

  const user = users[0];

  // Check if the password matches 
  const passwordMatch = await Bun.password.verify(body.password, user.password_hash);
  if (!passwordMatch) 
    return new Response("Invalid credentials", { status: 401 });
  

  // Return the user info
  return { userID: user.userID, email: user.email, full_name: user.full_name };
};

export const signup = async ({
  body,
}: {
  body: { email: string; password: string; full_name: string };
}) => {
  // Check if the email already exists in the database
  const existing = await db`SELECT userID FROM users WHERE email = ${body.email}`;
  // If it does, reject the email
  if (existing.length) return new Response("Email already in use", { status: 409 });

  // Hash the password before inserting
  const hashedPassword = await Bun.password.hash(body.password);

  // If not, insert new user into database
  await db`
    INSERT INTO users (email, password_hash, full_name, created_at, updated_at, is_active, auth_provider)
    VALUES (${body.email}, ${hashedPassword}, ${body.full_name}, NOW(), NOW(), 1, 'local')
  `;

  return { success: true };
};