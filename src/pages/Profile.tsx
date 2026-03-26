import { useState } from 'react';
import { Settings, Grid3X3, Bookmark, Tag, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import { currentUser, posts } from '@/data/mockData';

const tabs = [
  { icon: Grid3X3, label: 'Posts' },
  { icon: Bookmark, label: 'Saved' },
  { icon: Tag, label: 'Tagged' },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const userPosts = posts.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="md:ml-[72px] xl:ml-[245px]">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="md:hidden"><ChevronLeft size={24} /></button>
            <h2 className="font-display font-bold text-lg">{currentUser.username}</h2>
          </div>
          <Settings size={22} strokeWidth={1.5} className="text-foreground" />
        </header>

        <div className="max-w-[470px] mx-auto pb-20 md:pb-4">
          {/* Profile Info */}
          <div className="p-4">
            <div className="flex items-center gap-6">
              <div className="story-ring">
                <div className="story-ring-inner">
                  <img src={currentUser.avatar} alt={currentUser.username} className="h-20 w-20 rounded-full object-cover" />
                </div>
              </div>
              <div className="flex flex-1 justify-around text-center">
                <div><p className="font-display font-bold text-lg">{currentUser.postsCount}</p><p className="text-xs text-muted-foreground">Posts</p></div>
                <div><p className="font-display font-bold text-lg">{currentUser.followersCount.toLocaleString()}</p><p className="text-xs text-muted-foreground">Followers</p></div>
                <div><p className="font-display font-bold text-lg">{currentUser.followingCount}</p><p className="text-xs text-muted-foreground">Following</p></div>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold text-sm">{currentUser.displayName}</p>
              <p className="text-sm whitespace-pre-line mt-1">{currentUser.bio}</p>
              {currentUser.website && <p className="text-sm font-semibold text-accent mt-1">{currentUser.website}</p>}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold">Edit profile</button>
              <button className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold">Share profile</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-border">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${
                  activeTab === i ? 'border-foreground' : 'border-transparent text-muted-foreground'
                }`}
              >
                <tab.icon size={22} strokeWidth={1.5} />
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-0.5">
            {userPosts.map(post => (
              <div key={post.id} className="aspect-square cursor-pointer">
                <img src={post.images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
