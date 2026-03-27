import { useState } from 'react';
import { Send } from 'lucide-react';
import StoriesBar from '@/components/StoriesBar';
import PostCard from '@/components/PostCard';
import PostCardReal from '@/components/PostCardReal';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import CreatePostModal from '@/components/CreatePostModal';
import { usePosts } from '@/hooks/usePosts';
import { posts as mockPosts, suggestedUsers } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { posts, loading, fetchPosts, toggleLike, toggleSave, deletePost } = usePosts();
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const hasRealPosts = posts.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar onCreatePost={() => setCreateOpen(true)} />

      <div className="md:ml-[72px] xl:ml-[245px]">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl md:hidden">
          <h1 className="font-display text-xl font-bold">InstaVibe</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/messages')}><Send size={22} strokeWidth={1.5} /></button>
          </div>
        </header>

        <main className="mx-auto max-w-[470px] pb-20 md:pb-4 md:pt-4">
          <StoriesBar />

          {/* Suggested Users */}
          <div className="border-b border-border bg-card px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-muted-foreground">Suggested for you</p>
              <button className="text-xs font-semibold text-foreground">See All</button>
            </div>
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
