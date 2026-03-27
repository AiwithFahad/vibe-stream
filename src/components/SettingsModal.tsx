import { useState } from 'react';
import { X, Loader2, Shield, Bell, Lock, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const { profile, refreshProfile, signOut, user } = useAuth();
  const [activeSection, setActiveSection] = useState<'main' | 'edit' | 'privacy' | 'notifications'>('main');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [isPrivate, setIsPrivate] = useState(profile?.is_private || false);
  const [saving, setSaving] = useState(false);
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifFollows, setNotifFollows] = useState(true);

  const isDemoUser = user?.id === '00000000-0000-0000-0000-000000000001';

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    if (isDemoUser) {
      // Update localStorage for demo user
      const stored = JSON.parse(localStorage.getItem('instavibe_demo_user') || '{}');
      localStorage.setItem('instavibe_demo_user', JSON.stringify({
        ...stored,
        display_name: displayName,
        bio,
        website,
        is_private: isPrivate,
      }));
      toast.success('Profile updated');
      window.location.reload();
      return;
    }
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

  const menuItems = [
    { icon: User, label: 'Edit Profile', section: 'edit' as const },
    { icon: Lock, label: 'Privacy', section: 'privacy' as const },
    { icon: Bell, label: 'Notifications', section: 'notifications' as const },
  ];

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
              {activeSection !== 'main' ? (
                <button onClick={() => setActiveSection('main')} className="text-sm text-accent font-semibold">Back</button>
              ) : (
                <div />
              )}
              <h3 className="font-display font-bold text-sm">
                {activeSection === 'main' ? 'Settings' : activeSection === 'edit' ? 'Edit Profile' : activeSection === 'privacy' ? 'Privacy' : 'Notifications'}
              </h3>
              <button onClick={onClose}><X size={20} /></button>
            </div>

            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {activeSection === 'main' && (
                <>
                  {menuItems.map(item => (
                    <button
                      key={item.label}
                      onClick={() => setActiveSection(item.section)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 hover:bg-secondary transition-colors"
                    >
                      <item.icon size={20} className="text-muted-foreground" />
                      <span className="flex-1 text-sm text-left">{item.label}</span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              )}

              {activeSection === 'edit' && (
                <>
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
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save Changes'}
                  </button>
                </>
              )}

              {activeSection === 'privacy' && (
                <>
                  <label className="flex items-center justify-between cursor-pointer py-2">
                    <div>
                      <p className="text-sm font-medium">Private Account</p>
                      <p className="text-xs text-muted-foreground">Only followers can see your posts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={e => setIsPrivate(e.target.checked)}
                      className="rounded border-border h-5 w-5"
                    />
                  </label>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save'}
                  </button>
                </>
              )}

              {activeSection === 'notifications' && (
                <>
                  {[
                    { label: 'Likes', desc: 'Get notified when someone likes your post', value: notifLikes, set: setNotifLikes },
                    { label: 'Comments', desc: 'Get notified on new comments', value: notifComments, set: setNotifComments },
                    { label: 'New Followers', desc: 'Get notified when someone follows you', value: notifFollows, set: setNotifFollows },
                  ].map(item => (
                    <label key={item.label} className="flex items-center justify-between cursor-pointer py-2">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={item.value}
                        onChange={e => item.set(e.target.checked)}
                        className="rounded border-border h-5 w-5"
                      />
                    </label>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
