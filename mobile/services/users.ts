import { getApiBaseUrl } from '@/lib/api-config';
import { AuthService } from './auth';

// Shape of a user returned from GET /users/:id — maps to a row in the users table
export type UserProfile = {
  userID: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
};

// All fields are optional — the backend uses COALESCE so only sent fields are updated
export type UpdateUserData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
};

export const UserService = {
  // Fetch a user's profile by ID (requires a valid JWT)
  async getUser(id: number): Promise<UserProfile> {
    const res = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/users/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch user (${res.status})`);
    return res.json();
  },

  // Partially update a user. Only the fields included in data will change
  async updateUser(id: number, data: UpdateUserData): Promise<UserProfile> {
    const res = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.text()) || 'Failed to update user');
    return res.json();
  },

  // Permanently delete a user account
  async deleteUser(id: number): Promise<void> {
    const res = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/users/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete user (${res.status})`);
  },

  // Decode the JWT payload to read the user ID from the sub claim.
  // No need to verify the signature here as the server does that on every request.
  getUserIdFromToken(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ? Number(payload.sub) : null;
    } catch {
      return null;
    }
  },
};
