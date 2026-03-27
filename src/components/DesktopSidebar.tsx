import { Home, Search, PlusSquare, Heart, User, MessageCircle, Menu, LogOut, Film, LayoutDashboard, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SettingsModal from '@/components/SettingsModal';

const navItems = [
  { icon: Home, path: '/', label: 'Home' },
  { icon: Search, path: '/explore', label: 'Explore' },
  { icon: Film, path: '/reels', label: 'Reels' },
  { icon: MessageCircle, path: '/messages', label: 'Messages' },
  { icon: PlusSquare, path: '/create', label: 'Create' },
  { icon: Heart, path: '/notifications', label: 'Notifications' },
  { icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
  { icon: User, path: '/profile', label: 'Profile' },
];

interface DesktopSidebarProps {
  onCreatePost?: () => void;
}

const DesktopSidebar = ({ onCreatePost }: DesktopSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNav = (path: string) => {
    if (path === '/create' && onCreatePost) {
      onCreatePost();
      return;
    }
    navigate(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[72px] flex-col items-center border-r border-border bg-card py-8 md:flex xl:w-[245px]">
      <button onClick={() => navigate('/')} className="mb-10 px-3">
        <h1 className="hidden font-display text-xl font-bold xl:block">InstaVibe</h1>
        <span className="text-2xl font-bold xl:hidden">IV</span>
      </button>

      <nav className="flex flex-1 flex-col gap-1 w-full px-3">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className={`flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-secondary ${
                isActive ? 'font-semibold' : 'text-muted-foreground'
              }`}
            >
              <Icon
                size={24}
                fill={isActive ? 'currentColor' : 'none'}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className="hidden xl:inline text-sm">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="w-full px-3 relative">
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-4 rounded-lg px-3 py-3 text-muted-foreground hover:bg-secondary w-full"
        >
          <Menu size={24} strokeWidth={1.5} />
          <span className="hidden xl:inline text-sm">More</span>
        </button>
        {showMore && (
          <div className="absolute bottom-full left-3 mb-2 rounded-lg border border-border bg-card shadow-lg py-1 min-w-[180px]">
            <button
              onClick={() => { setSettingsOpen(true); setShowMore(false); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-secondary"
            >
              <Settings size={18} /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-secondary text-destructive"
            >
              <LogOut size={18} /> Log out
            </button>
          </div>
        )}
      </div>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </aside>
  );
};

export default DesktopSidebar;
