import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../atoms/Avatar';
import PostActions from './PostActions';

interface PostCardProps {
  id: string;
  title: string;
  body: string;
  thumbnailUrl?: string | null;
  author: {
    name: string;
    avatarUrl?: string | null;
  };
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  onLikeToggle?: (id: string) => void;
}

export default function PostCard({
  id,
  title,
  body,
  thumbnailUrl,
  author,
  likesCount,
  commentsCount,
  isLikedByMe,
  onLikeToggle,
}: PostCardProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback image using CSS gradient and icon
  const ImagePlaceholder = () => (
    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-card-border to-bg-dark text-text-muted">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-card-border bg-card-bg transition-all hover:border-input-focus/50 hover:shadow-lg hover:shadow-green-primary/5">
      <Link to={`/posts/${id}`} className="block overflow-hidden h-48">
        {!thumbnailUrl || imageError ? (
          <ImagePlaceholder />
        ) : (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/posts/${id}`} className="group flex-1">
          <h3 className="mb-2 text-lg font-bold text-text-primary group-hover:text-green-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-text-secondary line-clamp-3">
            {body}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <PostActions
            likesCount={likesCount}
            commentsCount={commentsCount}
            isLiked={isLikedByMe}
            onLikeToggle={() => onLikeToggle?.(id)}
          />
          
          <div className="flex items-center gap-2 pl-4">
            <Avatar src={author.avatarUrl} name={author.name} size="sm" />
            <span className="text-sm text-text-secondary">
              @{author.name.split(' ')[0].toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
