import { useState, useEffect, useCallback } from 'react';
import AppTemplate from '../components/templates/AppTemplate';
import SearchBar from '../components/molecules/SearchBar';
import FilterChip from '../components/atoms/FilterChip';
import PostGrid from '../components/organisms/PostGrid';
import { postsService, type Post } from '../services/postsService';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const filters = ['Front-end', 'React', 'Acessibilidade'];

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await postsService.getPosts(search);
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const handleLikeToggle = async (id: string) => {
    // Optimistic update
    setPosts(current => current.map(post => {
      if (post.id === id) {
        const isLiked = !post.isLikedByMe;
        return {
          ...post,
          isLikedByMe: isLiked,
          _count: {
            ...post._count,
            likes: post._count.likes + (isLiked ? 1 : -1)
          }
        };
      }
      return post;
    }));

    try {
      await postsService.toggleLike(id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert on error
      void fetchPosts();
    }
  };

  return (
    <AppTemplate>
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <SearchBar onSearch={setSearch} />
          
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <FilterChip key={filter} label={filter} isActive={false} />
            ))}
            <button className="ml-auto text-sm text-text-secondary hover:text-text-primary transition-colors">
              Limpar tudo
            </button>
          </div>
        </div>

        <div className="mb-8 border-b border-card-border">
          <div className="flex gap-8">
            <button className="border-b-2 border-green-primary pb-4 font-semibold text-green-primary">
              Recentes
            </button>
            <button className="border-b-2 border-transparent pb-4 font-medium text-text-secondary hover:text-text-primary transition-colors">
              Populares
            </button>
          </div>
        </div>

        <PostGrid posts={posts} isLoading={isLoading} onLikeToggle={handleLikeToggle} />
      </div>
    </AppTemplate>
  );
}
