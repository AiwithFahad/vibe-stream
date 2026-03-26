import { Home, Search, PlusSquare, Heart, User, MessageCircle, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, path: '/', label: 'Home' },
  { icon: Search, path: '/explore', label: 'Explore' },
  { icon: MessageCircle, path: '/messages', label: 'Messages' },
  { icon: PlusSquare, path: '/create', label: 'Create' },
  { icon: Heart, path: '/notifications', label: 'Notifications' },
  { icon: User, path: '/profile', label: 'Profile' },
];

const DesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
              onClick={() => navigate(path)}
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

      <button className="flex items-center gap-4 rounded-lg px-3 py-3 text-muted-foreground hover:bg-secondary w-full mx-3">
        <Menu size={24} strokeWidth={1.5} />
        <span className="hidden xl:inline text-sm">More</span>
      </button>
    </aside>
  );
};

export default DesktopSidebar;
