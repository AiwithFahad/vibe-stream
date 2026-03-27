import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  const DEMO_EMAIL = 'demo@instavibe.app';
  const DEMO_PASSWORD = 'demo1234';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Allow demo credentials to bypass backend auth
    if (isLogin && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem('instavibe_demo_user', JSON.stringify({
        id: 'demo-user-001',
        email: DEMO_EMAIL,
        username: 'demo_user',
        display_name: 'Demo User',
        avatar_url: null,
        bio: 'This is a demo account',
        website: '',
        is_private: false,
      }));
      setLoading(false);
      navigate('/');
      return;
    }

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate('/');
    } else {
      if (!username.trim()) { setError('Username is required'); setLoading(false); return; }
      const { error } = await signUp(email, password, username);
      if (error) setError(error.message);
      else navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-xl border border-border bg-card p-8">
          <h1 className="text-center font-display text-3xl font-bold mb-2">InstaVibe</h1>
          <p className="text-center text-sm text-muted-foreground mb-6">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                className="w-full rounded-lg bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full rounded-lg bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full rounded-lg bg-secondary px-4 py-3 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button className="w-full rounded-lg border border-border py-3 text-sm font-medium transition-colors hover:bg-secondary">
            Continue with Google
          </button>

          <div className="mt-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Email: <span className="font-mono text-foreground">demo@instavibe.app</span></p>
            <p>Password: <span className="font-mono text-foreground">demo1234</span></p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card p-4 text-center text-sm">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-semibold text-accent">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
