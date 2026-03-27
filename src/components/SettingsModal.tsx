import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const { profile, refreshProfile, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [isPrivate, setIsPrivate] = useState(profile?.is_private || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, bio, website, is_private: isPrivate })
      .eq('id', profile.id);
    if (error) toast.error(error.message);
    else {
      toast.success('Profile updated');
      await refreshProfile();
      onClose();
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
    window.location.href = '/login';
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl bg-card border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-display font-bold text-sm">Settings</h3>
              <button onClick={onClose}><X size={20} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Display Name</label>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Website</label>
                <input
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={e => setIsPrivate(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm">Private account</span>
              </label>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save Changes'}
              </button>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground"
              >
                Log Out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
