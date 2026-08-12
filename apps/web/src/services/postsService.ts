import { fetchApi } from './api';

export interface Post {
  id: string;
  title: string;
  body: string;
  thumbnailUrl?: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLikedByMe: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
}

export interface PostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const postsService = {
  getPosts: (search?: string, page = 1, limit = 10): Promise<PostsResponse> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    return fetchApi(`/posts?${params.toString()}`);
  },

  getPost: (id: string): Promise<Post> => {
    return fetchApi(`/posts/${id}`);
  },

  createPost: (data: { title: string; body: string; thumbnailUrl?: string }) => {
    return fetchApi('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  toggleLike: (id: string): Promise<{ liked: boolean }> => {
    return fetchApi(`/posts/${id}/likes`, {
      method: 'POST',
    });
  },

  addComment: (postId: string, content: string): Promise<Comment> => {
    return fetchApi(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};
