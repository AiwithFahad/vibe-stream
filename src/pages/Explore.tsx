import { useState } from 'react';
import { Search, Heart, MessageCircle, X, Send } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import { explorePostImages, posts as mockPosts, users, suggestedUsers } from '@/data/mockData';
import { AnimatePresence, motion } from 'framer-motion';

const trendingTags = ['#travel', '#foodie', '#architecture', '#sunset', '#coffee', '#nature', '#photography', '#vibes'];

const Explore = () => {
  const [query, setQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<typeof mockPosts[0] | null>(null);
  const [searchResults, setSearchResults] = useState<typeof users>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      const filtered = users.filter(u =>
        u.username.toLowerCase().includes(val.toLowerCase()) ||
        u.displayName.toLowerCase().includes(val.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="md:ml-[72px] xl:ml-[245px]">
        {/* Search */}
        <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl p-4 border-b border-border">
          <div className="relative max-w-[470px] mx-auto">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => query && setShowResults(true)}
              placeholder="Search users, hashtags, places..."
              className="w-full rounded-lg bg-secondary pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {query && (
              <button onClick={() => { setQuery(''); setShowResults(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="max-w-[470px] mx-auto mt-2 rounded-lg border border-border bg-card shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map(u => (
                <button key={u.id} className="flex w-full items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors">
                  <img src={u.avatar} alt="" className="h-10 w-10 rounded-full" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{u.username}</p>
                    <p className="text-xs text-muted-foreground">{u.displayName} · {u.followersCount.toLocaleString()} followers</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Trending tags */}
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar max-w-[470px] mx-auto">
            {trendingTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="flex-shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Users Section */}
        <div className="max-w-[470px] mx-auto border-b border-border px-4 py-3">
          <p className="text-sm font-semibold mb-3">Suggested for you</p>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {suggestedUsers.map(u => (
              <div key={u.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20">
                <img src={u.avatar} alt={u.username} className="h-14 w-14 rounded-full object-cover" />
                <p className="text-[11px] font-semibold truncate w-full text-center">{u.username}</p>
                <button className="w-full rounded-lg bg-accent py-1 text-[11px] font-semibold text-accent-foreground">Follow</button>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-[470px] mx-auto grid grid-cols-3 gap-0.5 pb-20 md:pb-4">
          {explorePostImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelectedPost(mockPosts[i % mockPosts.length])}
              className="relative aspect-square group cursor-pointer overflow-hidden"
            >
              <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-4 text-primary-foreground">
                  <span className="flex items-center gap-1 text-sm font-semibold"><Heart size={16} fill="currentColor" /> 2.4k</span>
                  <span className="flex items-center gap-1 text-sm font-semibold"><MessageCircle size={16} fill="currentColor" /> 48</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-xl bg-card border border-border overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <img src={selectedPost.user.avatar} alt="" className="h-8 w-8 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold">{selectedPost.user.username}</p>
                    {selectedPost.location && <p className="text-[11px] text-muted-foreground">{selectedPost.location}</p>}
                  </div>
                </div>
                <button onClick={() => setSelectedPost(null)}><X size={20} /></button>
              </div>
              <img src={selectedPost.images[0]} alt="" className="w-full aspect-square object-cover" />
              <div className="px-4 py-3">
                <div className="flex items-center gap-4 mb-2">
                  <Heart size={22} strokeWidth={1.5} className={selectedPost.isLiked ? 'text-accent fill-accent' : ''} />
                  <MessageCircle size={22} strokeWidth={1.5} />
                  <Send size={22} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold">{selectedPost.likes.toLocaleString()} likes</p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">{selectedPost.user.username}</span> {selectedPost.caption}
                </p>
                {selectedPost.comments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedPost.comments.map(c => (
                      <p key={c.id} className="text-sm">
                        <span className="font-semibold">{c.username}</span> {c.content}
                      </p>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-[10px] uppercase text-muted-foreground">{selectedPost.createdAt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Explore;
