import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy credentials
    if (isLogin) {
      if (email === 'demo@instavibe.app' && password === 'demo1234') {
        navigate('/');
      } else {
        setError('Invalid credentials. Use demo@instavibe.app / demo1234');
      }
    } else {
      navigate('/');
    }
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
              className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
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
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card p-4 text-center text-sm">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-semibold text-accent">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo: demo@instavibe.app / demo1234
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
