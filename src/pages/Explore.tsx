import { useState } from 'react';
import { Search, Grid3X3, Heart, MessageCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import { explorePostImages } from '@/data/mockData';

const trendingTags = ['#travel', '#foodie', '#architecture', '#sunset', '#coffee', '#nature'];

const Explore = () => {
  const [query, setQuery] = useState('');

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
              onChange={e => setQuery(e.target.value)}
              placeholder="Search users, hashtags, places..."
              className="w-full rounded-lg bg-secondary pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {/* Trending tags */}
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar max-w-[470px] mx-auto">
            {trendingTags.map(tag => (
              <button key={tag} className="flex-shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-[470px] mx-auto grid grid-cols-3 gap-0.5 pb-20 md:pb-4">
          {explorePostImages.map((img, i) => (
            <div key={i} className="relative aspect-square group cursor-pointer overflow-hidden">
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
      <BottomNav />
    </div>
  );
};

export default Explore;
