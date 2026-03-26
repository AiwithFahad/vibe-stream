import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post } from '@/data/mockData';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);
  const [showHeart, setShowHeart] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDoubleClick = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes(prev => prev + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const formatLikes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : n.toString();

  return (
    <article className="border-b border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="story-ring">
            <div className="story-ring-inner">
              <img src={post.user.avatar} alt={post.user.username} className="h-8 w-8 rounded-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">{post.user.username}</p>
            {post.location && <p className="text-[11px] text-muted-foreground">{post.location}</p>}
          </div>
        </div>
        <button className="text-muted-foreground"><MoreHorizontal size={20} /></button>
      </div>

      {/* Image */}
      <div className="relative" onDoubleClick={handleDoubleClick}>
        <img
          src={post.images[0]}
          alt={post.caption}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
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

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button onClick={toggleLike}>
            <Heart
              size={24}
              className={isLiked ? 'text-accent fill-accent animate-heart-pop' : 'text-foreground'}
              strokeWidth={1.5}
            />
          </button>
          <button><MessageCircle size={24} strokeWidth={1.5} /></button>
          <button><Send size={24} strokeWidth={1.5} /></button>
        </div>
        <button onClick={() => setIsSaved(!isSaved)}>
          <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm font-semibold">{formatLikes(likes)} likes</p>
        <p className="mt-1 text-sm">
          <span className="font-semibold">{post.user.username}</span>{' '}
          {post.caption}
        </p>
        {post.comments.length > 0 && (
          <button className="mt-1 text-sm text-muted-foreground">
            View {post.comments.length === 1 ? '1 comment' : `all ${post.comments.length} comments`}
          </button>
        )}
        <p className="mt-1 text-[10px] uppercase text-muted-foreground tracking-wide">{post.createdAt}</p>
      </div>
    </article>
  );
};

export default PostCard;
