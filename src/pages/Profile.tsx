import { useState, useEffect, useRef } from 'react';
import { Settings, Grid3X3, Bookmark, Tag, ChevronLeft, Camera, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import SettingsModal from '@/components/SettingsModal';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const tabs = [
  { icon: Grid3X3, label: 'Posts' },
  { icon: Bookmark, label: 'Saved' },
  { icon: Tag, label: 'Tagged' },
];

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, profile: myProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewProfile, setViewProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = !userId || userId === user?.id;
  const profileId = isOwnProfile ? user?.id : userId;
  const { posts, loading: postsLoading } = usePosts(profileId);
  const displayProfile = isOwnProfile ? myProfile : viewProfile;

  useEffect(() => {
    if (!isOwnProfile && userId) {
      supabase.from('profiles').select('*').eq('id', userId).single().then(({ data }) => setViewProfile(data));
    }
  }, [userId, isOwnProfile]);

  useEffect(() => {
    if (profileId) {
      supabase.from('followers').select('id').eq('following_id', profileId).then(({ data }) => setFollowersCount(data?.length || 0));
      supabase.from('followers').select('id').eq('follower_id', profileId).then(({ data }) => setFollowingCount(data?.length || 0));
      if (!isOwnProfile && user) {
        supabase.from('followers').select('id').eq('follower_id', user.id).eq('following_id', profileId).then(({ data }) => setIsFollowing((data?.length || 0) > 0));
      }
    }
  }, [profileId, isOwnProfile, user]);

  const handleFollow = async () => {
    if (!user || !profileId) return;
    if (isFollowing) {
      await supabase.from('followers').delete().eq('follower_id', user.id).eq('following_id', profileId);
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
    } else {
      await supabase.from('followers').insert({ follower_id: user.id, following_id: profileId });
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase.from('profiles').update({ avatar_url: data.publicUrl + '?t=' + Date.now() }).eq('id', user.id);
    await refreshProfile();
    setAvatarUploading(false);
    toast.success('Avatar updated');
  };

  if (!displayProfile) {
    return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="md:ml-[72px] xl:ml-[245px]">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="md:hidden"><ChevronLeft size={24} /></button>
            <h2 className="font-display font-bold text-lg">{displayProfile.username}</h2>
          </div>
          {isOwnProfile && <button onClick={() => setSettingsOpen(true)}><Settings size={22} strokeWidth={1.5} className="text-foreground" /></button>}
        </header>

        <div className="max-w-[470px] mx-auto pb-20 md:pb-4">
          <div className="p-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="story-ring">
                  <div className="story-ring-inner">
                    <img
                      src={displayProfile.avatar_url || `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${displayProfile.username}`}
                      alt={displayProfile.username}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() => avatarRef.current?.click()}
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-accent flex items-center justify-center text-accent-foreground"
                  >
                    {avatarUploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={14} />}
                  </button>
                )}
                <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
              <div className="flex flex-1 justify-around text-center">
                <div><p className="font-display font-bold text-lg">{posts.length}</p><p className="text-xs text-muted-foreground">Posts</p></div>
                <div><p className="font-display font-bold text-lg">{followersCount}</p><p className="text-xs text-muted-foreground">Followers</p></div>
                <div><p className="font-display font-bold text-lg">{followingCount}</p><p className="text-xs text-muted-foreground">Following</p></div>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold text-sm">{displayProfile.display_name || displayProfile.username}</p>
              {displayProfile.bio && <p className="text-sm whitespace-pre-line mt-1">{displayProfile.bio}</p>}
              {displayProfile.website && <p className="text-sm font-semibold text-accent mt-1">{displayProfile.website}</p>}
            </div>
            <div className="flex gap-2 mt-4">
              {isOwnProfile ? (
                <>
                  <button onClick={() => setSettingsOpen(true)} className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold">Edit profile</button>
                  <button className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold">Share profile</button>
                </>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`flex-1 rounded-lg py-1.5 text-sm font-semibold ${isFollowing ? 'bg-secondary' : 'bg-accent text-accent-foreground'}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

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

          <div className="grid grid-cols-3 gap-0.5">
            {posts.map(post => {
              const media = post.post_media?.[0]?.media_url;
              return media ? (
                <div key={post.id} className="aspect-square cursor-pointer">
                  <img src={media} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ) : null;
            })}
            {posts.length === 0 && !postsLoading && (
              <div className="col-span-3 py-20 text-center text-muted-foreground text-sm">
                {isOwnProfile ? 'No posts yet. Create your first post!' : 'No posts yet.'}
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
      {isOwnProfile && <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
};

export default Profile;
