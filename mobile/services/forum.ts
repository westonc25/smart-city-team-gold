import { getApiBaseUrl } from '@/lib/api-config';
import { AuthService } from './auth';

// Builds the Authorization header using the stored JWT token.
// All forum endpoints require authentication.
const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const token = await AuthService.getToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
};

export const ForumService = {

    // Fetches all forum posts within 15 miles of the user.
    // The backend determines proximity using the user's session location.
    async getPosts(): Promise<unknown> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiBaseUrl()}/forum/posts`, { headers });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts (${response.status})`);
        }

        return response.json();
    },

    // Creates a new forum post. The backend attaches the user's current
    // location to the post using their active session.
    async createPost(
        title: string,
        content: string,
        category: string,
        location_name?: string
    ): Promise<{ post: unknown }> {
        const headers = await getAuthHeaders();

        const response = await fetch(`${getApiBaseUrl()}/forum/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({ title, content, category, location_name }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to create post');
        }

        return response.json();
    },

    // Posts a comment on a specific forum post.
    async createComment(postId: string, content: string): Promise<Record<string, unknown>> {
        const headers = await getAuthHeaders();

        const response = await fetch(`${getApiBaseUrl()}/forum/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to post comment');
        }

        return response.json();
    },
};
