import PostCard from '../molecules/PostCard';

interface Post {
  id: string;
  title: string;
  body: string;
  thumbnailUrl?: string | null;
  author: {
    name: string;
    avatarUrl?: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLikedByMe: boolean;
}

interface PostGridProps {
  posts: Post[];
  isLoading?: boolean;
  onLikeToggle?: (id: string) => void;
}

export default function PostGrid({ posts, isLoading, onLikeToggle }: PostGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex h-[360px] animate-pulse flex-col rounded-xl border border-card-border bg-card-bg">
            <div className="h-48 w-full bg-card-border/50"></div>
            <div className="flex-1 p-5">
              <div className="mb-3 h-6 w-3/4 rounded bg-card-border/50"></div>
              <div className="mb-2 h-4 w-full rounded bg-card-border/50"></div>
              <div className="mb-6 h-4 w-2/3 rounded bg-card-border/50"></div>
              <div className="mt-auto flex justify-between">
                <div className="h-6 w-24 rounded bg-card-border/50"></div>
                <div className="h-6 w-24 rounded bg-card-border/50"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-card-border py-20 text-center">
        <svg className="mb-4 text-text-muted" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <h3 className="text-lg font-medium text-text-primary">Nenhum post encontrado</h3>
        <p className="mt-2 text-sm text-text-secondary">Tente ajustar seus filtros ou termo de busca.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          body={post.body}
          thumbnailUrl={post.thumbnailUrl}
          author={post.author}
          likesCount={post._count.likes}
          commentsCount={post._count.comments}
          isLikedByMe={post.isLikedByMe}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </div>
  );
}
