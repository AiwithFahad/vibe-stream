import { useState } from 'react';
import { Camera, Send, MessageCircle } from 'lucide-react';
import StoriesBar from '@/components/StoriesBar';
import PostCard from '@/components/PostCard';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import { posts } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />

      <div className="md:ml-[72px] xl:ml-[245px]">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl md:hidden">
          <h1 className="font-display text-xl font-bold">InstaVibe</h1>
          <div className="flex items-center gap-4">
            <button><Send size={22} strokeWidth={1.5} /></button>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-[470px] pb-20 md:pb-4 md:pt-4">
          <StoriesBar />
          <div>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
