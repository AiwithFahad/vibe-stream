import { useState } from 'react';
import { Send } from 'lucide-react';
import StoriesBar from '@/components/StoriesBar';
import PostCardReal from '@/components/PostCardReal';
import PostCard from '@/components/PostCard';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import CreatePostModal from '@/components/CreatePostModal';
import { usePosts } from '@/hooks/usePosts';
import { posts as mockPosts } from '@/data/mockData';

const Index = () => {
  const { posts, loading, fetchPosts, toggleLike, toggleSave, deletePost } = usePosts();
  const [createOpen, setCreateOpen] = useState(false);

  const hasRealPosts = posts.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar onCreatePost={() => setCreateOpen(true)} />

      <div className="md:ml-[72px] xl:ml-[245px]">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl md:hidden">
          <h1 className="font-display text-xl font-bold">InstaVibe</h1>
          <div className="flex items-center gap-4">
            <button><Send size={22} strokeWidth={1.5} /></button>
          </div>
        </header>

        <main className="mx-auto max-w-[470px] pb-20 md:pb-4 md:pt-4">
          <StoriesBar />
          <div>
            {hasRealPosts ? (
              posts.map(post => (
                <PostCardReal
                  key={post.id}
                  post={post}
                  onToggleLike={toggleLike}
                  onToggleSave={toggleSave}
                  onDelete={deletePost}
                />
              ))
            ) : loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
            ) : (
              // Show mock posts as demo when no real posts exist
              mockPosts.map(post => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </main>
      </div>

      <BottomNav onCreatePost={() => setCreateOpen(true)} />
      <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} onPostCreated={fetchPosts} />
    </div>
  );
};

export default Index;
