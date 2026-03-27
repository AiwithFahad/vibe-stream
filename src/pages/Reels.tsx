import { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import { users } from '@/data/mockData';

interface Reel {
  id: string;
  videoUrl: string;
  poster: string;
  user: { id: string; username: string; avatar: string };
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  audio: string;
  isLiked: boolean;
  isSaved: boolean;
}

const sampleReels: Reel[] = [
  {
    id: 'r1', videoUrl: '', poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
    user: { id: '1', username: users[0].username, avatar: users[0].avatar },
    caption: 'Golden hour magic at Santorini 🌅 #travel #sunset', likes: 12400, comments: 342, shares: 89, audio: 'Original Audio',
    isLiked: false, isSaved: false,
  },
  {
    id: 'r2', videoUrl: '', poster: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=700&fit=crop',
    user: { id: '3', username: users[2].username, avatar: users[2].avatar },
    caption: 'Summit views hit different 🏔️ #mountains #adventure', likes: 8900, comments: 178, shares: 56, audio: 'Epic Adventure Mix',
    isLiked: false, isSaved: false,
  },
  {
    id: 'r3', videoUrl: '', poster: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=700&fit=crop',
    user: { id: '2', username: users[1].username, avatar: users[1].avatar },
    caption: 'Morning coffee art ☕ #coffee #art', likes: 5600, comments: 95, shares: 34, audio: 'Chill Beats',
    isLiked: false, isSaved: false,
  },
  {
    id: 'r4', videoUrl: '', poster: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=700&fit=crop',
    user: { id: '5', username: users[4].username, avatar: users[4].avatar },
    caption: 'Paradise is a state of mind 🏝️ #beach #maldives', likes: 23100, comments: 567, shares: 210, audio: 'Tropical Vibes',
    isLiked: false, isSaved: false,
  },
  {
    id: 'r5', videoUrl: '', poster: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=700&fit=crop',
    user: { id: '6', username: users[5].username, avatar: users[5].avatar },
    caption: 'Architecture poetry 🏛️ #urban #design', likes: 4300, comments: 78, shares: 22, audio: 'Lo-fi Chill',
    isLiked: false, isSaved: false,
  },
];

const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

const ReelCard = ({ reel, isActive }: { reel: Reel; isActive: boolean }) => {
  const [liked, setLiked] = useState(reel.isLiked);
  const [saved, setSaved] = useState(reel.isSaved);
  const [likes, setLikes] = useState(reel.likes);
  const [showHeart, setShowHeart] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ id: string; text: string; user: string }[]>([]);

  const toggleLike = () => {
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
  };

  const doubleTapLike = () => {
    if (!liked) { setLiked(true); setLikes(p => p + 1); }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments(p => [...p, { id: Date.now().toString(), text: commentText, user: 'you' }]);
    setCommentText('');
  };

  return (
    <div className="relative h-full w-full snap-start bg-black flex items-center justify-center" onDoubleClick={doubleTapLike}>
      <img src={reel.poster} alt="" className="h-full w-full object-cover" />

      {/* Double-tap heart */}
      <AnimatePresence>
        {showHeart && (
          <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1.2, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart size={80} fill="white" className="text-white drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute toggle */}
      <button onClick={() => setMuted(!muted)} className="absolute top-4 right-4 z-10 rounded-full bg-black/40 p-2">
        {muted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
      </button>

      {/* Right side actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        <button onClick={toggleLike} className="flex flex-col items-center gap-1">
          <Heart size={28} className={liked ? 'text-red-500' : 'text-white'} fill={liked ? 'currentColor' : 'none'} />
          <span className="text-[11px] text-white font-semibold">{formatCount(likes)}</span>
        </button>
        <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1">
          <MessageCircle size={28} className="text-white" />
          <span className="text-[11px] text-white font-semibold">{formatCount(reel.comments + comments.length)}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Send size={24} className="text-white" />
          <span className="text-[11px] text-white font-semibold">{formatCount(reel.shares)}</span>
        </button>
        <button onClick={() => setSaved(!saved)}>
          <Bookmark size={28} className={saved ? 'text-white' : 'text-white'} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button><MoreHorizontal size={24} className="text-white" /></button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-3 right-16 text-white">
        <div className="flex items-center gap-2 mb-2">
          <img src={reel.user.avatar} alt="" className="h-8 w-8 rounded-full border border-white/50" />
          <span className="text-sm font-semibold">{reel.user.username}</span>
          <button className="rounded border border-white/70 px-3 py-0.5 text-xs font-semibold">Follow</button>
        </div>
        <p className="text-sm line-clamp-2">{reel.caption}</p>
        <div className="flex items-center gap-2 mt-2">
          <Music size={12} />
          <p className="text-xs truncate">{reel.audio}</p>
        </div>
      </div>

      {/* Comments drawer */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="absolute inset-x-0 bottom-0 h-[60%] bg-card rounded-t-2xl z-20 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-sm">Comments</h3>
              <button onClick={() => setShowComments(false)} className="text-muted-foreground text-sm">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No comments yet. Be the first!</p>}
              {comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">{c.user[0].toUpperCase()}</div>
                  <div>
                    <span className="text-xs font-semibold">{c.user}</span>
                    <p className="text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addComment()} placeholder="Add a comment..." className="flex-1 bg-secondary rounded-full px-4 py-2 text-sm focus:outline-none" />
              <button onClick={addComment} className="text-accent font-semibold text-sm">Post</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Reels = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setActiveIndex(idx);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <DesktopSidebar />
      <div className="md:ml-[72px] xl:ml-[245px] h-screen">
        <div ref={containerRef} onScroll={handleScroll} className="h-full overflow-y-scroll snap-y snap-mandatory">
          {sampleReels.map((reel, i) => (
            <div key={reel.id} className="h-screen w-full snap-start">
              <ReelCard reel={reel} isActive={i === activeIndex} />
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Reels;
