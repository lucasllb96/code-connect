import { useState } from 'react';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import { useAuth } from '../../contexts/AuthContext';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    avatarUrl?: string | null;
  };
}

interface PostCommentsProps {
  comments: Comment[];
  onSubmitComment: (content: string) => Promise<void>;
}

export default function PostComments({ comments, onSubmitComment }: PostCommentsProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-card-border bg-card-bg p-6">
      <h3 className="mb-6 text-lg font-bold text-text-primary">
        Comentários ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <Avatar src={user.avatarUrl} name={user.name} size="md" />
          <div className="flex-1 flex flex-col items-end gap-3">
            <textarea
              className="w-full resize-none rounded-lg border border-input-border bg-input-bg p-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-input-focus focus:ring-1 focus:ring-input-focus/30"
              placeholder="Adicione um comentário..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-6 py-2 text-sm"
            >
              {isSubmitting ? 'Enviando...' : 'Comentar'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-lg bg-input-bg p-4 text-center text-sm text-text-secondary border border-card-border">
          Faça login para deixar um comentário.
        </div>
      )}

      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar src={comment.author.avatarUrl} name={comment.author.name} size="md" />
            <div className="flex-1">
              <div className="mb-1 flex items-baseline gap-2">
                <span className="font-semibold text-text-primary">
                  {comment.author.name}
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center text-sm text-text-muted py-4">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </div>
        )}
      </div>
    </div>
  );
}
