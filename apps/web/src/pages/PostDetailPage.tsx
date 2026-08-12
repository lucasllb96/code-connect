import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppTemplate from '../components/templates/AppTemplate';
import Avatar from '../components/atoms/Avatar';
import PostActions from '../components/molecules/PostActions';
import PostComments from '../components/organisms/PostComments';
import { postsService, type Post } from '../services/postsService';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await postsService.getPost(id);
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    void fetchPost();
  }, [fetchPost]);

  const handleLikeToggle = async () => {
    if (!post || !id) return;

    // Optimistic update
    const isLiked = !post.isLikedByMe;
    setPost({
      ...post,
      isLikedByMe: isLiked,
      _count: {
        ...post._count,
        likes: post._count.likes + (isLiked ? 1 : -1)
      }
    });

    try {
      await postsService.toggleLike(id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert on error
      void fetchPost();
    }
  };

  const handleAddComment = async (content: string) => {
    if (!id) return;
    try {
      const newComment = await postsService.addComment(id, content);
      setPost(current => current ? {
        ...current,
        _count: {
          ...current._count,
          comments: current._count.comments + 1
        },
        comments: [newComment, ...(current.comments || [])]
      } : null);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (isLoading || !post) {
    return (
      <AppTemplate>
        <div className="flex h-full min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-primary border-t-transparent"></div>
        </div>
      </AppTemplate>
    );
  }

  const ImagePlaceholder = () => (
    <div className="flex h-96 w-full items-center justify-center bg-gradient-to-br from-card-border to-bg-dark text-text-muted">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );

  return (
    <AppTemplate>
      <article className="mx-auto max-w-4xl px-8 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-text-secondary hover:text-green-primary transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar
        </button>

        {/* Thumbnail */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-xl">
          {!post.thumbnailUrl || imageError ? (
            <ImagePlaceholder />
          ) : (
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="h-96 w-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Header content */}
        <header className="mb-10">
          <h1 className="mb-6 text-3xl font-bold leading-tight text-text-primary md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar src={post.author.avatarUrl} name={post.author.name} size="lg" />
              <div>
                <div className="font-semibold text-text-primary">{post.author.name}</div>
                <div className="text-sm text-text-secondary">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <PostActions
              likesCount={post._count.likes}
              commentsCount={post._count.comments}
              isLiked={post.isLikedByMe}
              onLikeToggle={handleLikeToggle}
            />
          </div>
        </header>

        {/* Body content */}
        <div className="prose prose-invert prose-green mb-16 max-w-none text-lg leading-relaxed text-text-secondary">
          {post.body.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-6">{paragraph}</p>
          ))}
        </div>

        {/* Comments Section */}
        <PostComments
          comments={post.comments || []}
          onSubmitComment={handleAddComment}
        />
      </article>
    </AppTemplate>
  );
}
