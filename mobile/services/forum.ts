import { getApiBaseUrl } from '@/lib/api-config';
import { AuthService } from './auth';

export const ForumService = {

    async getPosts(): Promise<unknown> {
        const response = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/forum/posts`);
        if (!response.ok) throw new Error(`Failed to fetch posts (${response.status})`);
        return response.json();
    },

    async createPost(
        title: string,
        content: string,
        category: string,
        location_name?: string
    ): Promise<{ post: unknown }> {
        const response = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/forum/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, category, location_name }),
        });
        if (!response.ok) throw new Error((await response.text()) || 'Failed to create post');
        return response.json();
    },

    async getPost(postId: string): Promise<unknown> {
        const response = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/forum/posts/${postId}`);
        if (!response.ok) throw new Error(`Failed to fetch post (${response.status})`);
        return response.json();
    },

    async getComments(postId: string): Promise<unknown> {
        const response = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/forum/posts/${postId}/comments`);
        if (!response.ok) throw new Error(`Failed to fetch comments (${response.status})`);
        return response.json();
    },

    async createComment(postId: string, content: string): Promise<Record<string, unknown>> {
        const response = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/forum/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error((await response.text()) || 'Failed to post comment');
        return response.json();
    },

    async deletePost(postId: string): Promise<void> {
        const response = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/forum/posts/${postId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete post (${response.status})`);
    },

    async deleteComment(postId: string, commentId: string): Promise<void> {
        const response = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/forum/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete comment (${response.status})`);
    },

    async votePost(postId: string, direction: 'up' | 'down' | null): Promise<unknown> {
        const response = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/forum/posts/${postId}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction }),
        });
        if (!response.ok) throw new Error(`Failed to vote on post (${response.status})`);
        return response.json();
    },

    async voteComment(postId: string, commentId: string, direction: 'up' | 'down' | null): Promise<unknown> {
        const response = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/forum/posts/${postId}/comments/${commentId}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction }),
        });
        if (!response.ok) throw new Error(`Failed to vote on comment (${response.status})`);
        return response.json();
    },
};
