import { Home, Search, PlusSquare, Film, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, path: '/', label: 'Home' },
  { icon: Search, path: '/explore', label: 'Explore' },
  { icon: PlusSquare, path: '/create', label: 'Create' },
  { icon: Film, path: '/reels', label: 'Reels' },
  { icon: User, path: '/profile', label: 'Profile' },
];

interface BottomNavProps {
  onCreatePost?: () => void;
}

const BottomNav = ({ onCreatePost }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    if (path === '/create' && onCreatePost) {
      onCreatePost();
      return;
    }
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className="relative flex flex-col items-center gap-0.5 p-2"
              aria-label={label}
            >
              <Icon
                size={24}
                className={isActive ? 'text-foreground' : 'text-muted-foreground'}
                fill={isActive ? 'currentColor' : 'none'}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="h-1 w-1 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
