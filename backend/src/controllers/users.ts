import { db } from "../db";

// Gets a user from the database
export const getUser = async ({ params }: { params: { id: string } }) => {
  const users = await db`
    SELECT userID, email, full_name, created_at, is_active, auth_provider
    FROM users
    WHERE userID = ${params.id} AND is_active = 1
  `;
  // If the user has not signed up then we cannot find them
  if (!users.length) return new Response("User not found", { status: 404 });
  return users[0];
};

// Updates user information in the database
export const updateUser = async ({params, body }: {
  params: { id: string };
  body: { full_name?: string; email?: string };
}) => {
  await db`
    UPDATE users
    SET full_name = ${body.full_name}, updated_at = NOW()
    WHERE userID = ${params.id}
  `;
  return { success: true };
};
