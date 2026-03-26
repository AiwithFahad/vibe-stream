import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import { notifications, suggestedUsers } from '@/data/mockData';
import type { Notification } from '@/data/mockData';

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
};

const NotificationItem = ({ n }: { n: Notification }) => {
  const Icon = iconMap[n.type];
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${!n.read ? 'bg-accent/5' : ''}`}>
      <img src={n.user.avatar} alt={n.user.username} className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{n.user.username}</span>{' '}
          <span className="text-muted-foreground">{n.content}</span>{' '}
          <span className="text-muted-foreground text-xs">{n.createdAt}</span>
        </p>
      </div>
      {n.postImage && <img src={n.postImage} alt="" className="h-10 w-10 rounded object-cover flex-shrink-0" />}
      {n.type === 'follow' && (
        <button className="flex-shrink-0 rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">Follow</button>
      )}
    </div>
  );
};

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="md:ml-[72px] xl:ml-[245px]">
        <header className="sticky top-0 z-40 border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl">
          <h2 className="font-display font-bold text-lg text-center">Notifications</h2>
        </header>
        <div className="max-w-[470px] mx-auto pb-20 md:pb-4">
          {/* Suggestions */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold mb-3">Suggested for you</p>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
              {suggestedUsers.map(u => (
                <div key={u.id} className="flex flex-col items-center gap-2 w-24 flex-shrink-0">
                  <img src={u.avatar} alt={u.username} className="h-14 w-14 rounded-full object-cover" />
                  <p className="text-xs font-semibold truncate w-full text-center">{u.username}</p>
                  <button className="w-full rounded-lg bg-accent py-1 text-xs font-semibold text-accent-foreground">Follow</button>
                </div>
              ))}
            </div>
          </div>
          {/* Notifications list */}
          <div>
            {notifications.map(n => <NotificationItem key={n.id} n={n} />)}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Notifications;
