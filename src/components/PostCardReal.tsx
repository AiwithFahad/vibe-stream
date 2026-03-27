import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import type { PostWithDetails } from '@/hooks/usePosts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface PostCardRealProps {
  post: PostWithDetails;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const PostCardReal = ({ post, onToggleLike, onToggleSave, onDelete }: PostCardRealProps) => {
  const { user } = useAuth();
  const [showHeart, setShowHeart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  const isLiked = user ? post.likes.some(l => l.user_id === user.id) : false;
  const isSaved = user ? post.saved_posts.some(s => s.user_id === user.id) : false;
  const likesCount = post.likes.length;
  const isOwner = user?.id === post.user_id;

  const handleDoubleClick = () => {
    if (!isLiked) onToggleLike(post.id);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const formatLikes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : n.toString();

  const mediaUrl = post.post_media?.[0]?.media_url;

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles:user_id (username, avatar_url)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
    setShowComments(true);
  };

  const submitComment = async () => {
    if (!user || !commentText.trim()) return;
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: post.id, user_id: user.id, content: commentText })
      .select('*, profiles:user_id (username, avatar_url)')
      .single();
    if (!error && data) {
      setComments(prev => [...prev, data]);
      setCommentText('');
    }
  };

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
    } catch {
      return '';
    }
  })();

  return (
    <article className="border-b border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="story-ring">
            <div className="story-ring-inner">
              <img
                src={post.profiles?.avatar_url || `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${post.profiles?.username}`}
                alt={post.profiles?.username}
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">{post.profiles?.username}</p>
            {post.location && <p className="text-[11px] text-muted-foreground">{post.location}</p>}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="text-muted-foreground">
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-50 rounded-lg border border-border bg-card shadow-lg py-1 min-w-[140px]">
              {isOwner && (
                <>
                  <button
                    onClick={() => { onDelete?.(post.id); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              )}
              <button
                onClick={() => setShowMenu(false)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      {mediaUrl && (
        <div className="relative" onDoubleClick={handleDoubleClick}>
          <img src={mediaUrl} alt={post.caption} className="w-full aspect-square object-cover" loading="lazy" />
          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart size={80} className="text-accent-foreground fill-accent-foreground drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button onClick={() => onToggleLike(post.id)}>
            <Heart
              size={24}
              className={isLiked ? 'text-accent fill-accent animate-heart-pop' : 'text-foreground'}
              strokeWidth={1.5}
            />
          </button>
          <button onClick={loadComments}><MessageCircle size={24} strokeWidth={1.5} /></button>
          <button><Send size={24} strokeWidth={1.5} /></button>
        </div>
        <button onClick={() => onToggleSave(post.id)}>
          <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm font-semibold">{formatLikes(likesCount)} likes</p>
        <p className="mt-1 text-sm">
          <span className="font-semibold">{post.profiles?.username}</span>{' '}
          {post.caption}
        </p>

        {post.comments.length > 0 && !showComments && (
          <button onClick={loadComments} className="mt-1 text-sm text-muted-foreground">
            View {post.comments.length === 1 ? '1 comment' : `all ${post.comments.length} comments`}
          </button>
        )}

        {showComments && (
          <div className="mt-2 space-y-2">
            {comments.map(c => (
              <p key={c.id} className="text-sm">
                <span className="font-semibold">{c.profiles?.username}</span>{' '}
                {c.content}
              </p>
            ))}
          </div>
        )}

        <p className="mt-1 text-[10px] uppercase text-muted-foreground tracking-wide">{timeAgo}</p>

        {/* Comment input */}
        {user && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitComment()}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            {commentText.trim() && (
              <button onClick={submitComment} className="text-sm font-semibold text-accent">Post</button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCardReal;
