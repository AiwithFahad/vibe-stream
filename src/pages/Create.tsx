import { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, MapPin, Loader2, Trash2, Edit3, Plus, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DesktopSidebar from '@/components/DesktopSidebar';
import BottomNav from '@/components/BottomNav';
import type { PostWithDetails } from '@/hooks/usePosts';

const Create = () => {
  const { user, profile } = useAuth();
  const { posts, loading, fetchPosts, deletePost } = usePosts(user?.id);
  const [tab, setTab] = useState<'create' | 'manage'>('create');

  // Create form state
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editingPost, setEditingPost] = useState<PostWithDetails | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Menu state
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selected]);
    selected.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeFile = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const extractHashtags = (text: string): string[] => {
    const matches = text.match(/#\w+/g);
    return matches ? matches.map(t => t.slice(1).toLowerCase()) : [];
  };

  const handleCreate = async () => {
    if (!user || files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    setPosting(true);
    try {
      const hashtags = extractHashtags(caption);
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({ user_id: user.id, caption, location, hashtags })
        .select()
        .single();
      if (postError || !post) throw postError;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${post.id}/${i}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('posts').upload(path, file, { contentType: file.type });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('posts').getPublicUrl(path);
        await supabase.from('post_media').insert({
          post_id: post.id,
          media_url: urlData.publicUrl,
          media_type: file.type.startsWith('video') ? 'video' : 'image',
          sort_order: i,
        });
      }

      toast.success('Post created!');
      setFiles([]);
      setPreviews([]);
      setCaption('');
      setLocation('');
      fetchPosts();
      setTab('manage');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = (post: PostWithDetails) => {
    setEditingPost(post);
    setEditCaption(post.caption || '');
    setEditLocation(post.location || '');
    setMenuOpenId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;
    setSaving(true);
    try {
      const hashtags = extractHashtags(editCaption);
      const { error } = await supabase
        .from('posts')
        .update({ caption: editCaption, location: editLocation, hashtags })
        .eq('id', editingPost.id);
      if (error) throw error;
      toast.success('Post updated!');
      setEditingPost(null);
      fetchPosts();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      toast.success('Post deleted');
      setDeleteConfirmId(null);
      setMenuOpenId(null);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const isDemoUser = user?.id === '00000000-0000-0000-0000-000000000001';

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="md:ml-[72px] xl:ml-[245px]">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl px-4 py-3">
          <h1 className="font-display text-lg font-bold text-center">Create & Manage Posts</h1>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${tab === 'create' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
          >
            <Plus size={16} className="inline mr-1" /> New Post
          </button>
          <button
            onClick={() => setTab('manage')}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${tab === 'manage' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
          >
            <Edit3 size={16} className="inline mr-1" /> My Posts ({posts.length})
          </button>
        </div>

        <main className="mx-auto max-w-2xl pb-20 md:pb-4">
          {tab === 'create' ? (
            <div className="p-4 space-y-4">
              {/* Media upload */}
              {previews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive flex items-center justify-center"
                      >
                        <X size={12} className="text-destructive-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-16 text-muted-foreground hover:border-accent transition-colors w-full"
                >
                  <ImageIcon size={48} strokeWidth={1} />
                  <p className="text-sm font-medium">Drag photos and videos here</p>
                  <span className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
                    Select from computer
                  </span>
                </button>
              )}

              <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={handleFiles} className="hidden" />

              {previews.length > 0 && (
                <button onClick={() => fileRef.current?.click()} className="text-xs text-accent font-semibold">
                  + Add more
                </button>
              )}

              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Write a caption... Use #hashtags"
                rows={3}
                className="w-full rounded-lg bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />

              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-muted-foreground" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Add location"
                  className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {extractHashtags(caption).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {extractHashtags(caption).map(tag => (
                    <span key={tag} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent font-medium">#{tag}</span>
                  ))}
                </div>
              )}

              <button
                onClick={handleCreate}
                disabled={posting || files.length === 0 || isDemoUser}
                className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground disabled:opacity-50 transition-colors hover:bg-accent/90"
              >
                {posting ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                {posting ? 'Sharing...' : 'Share Post'}
              </button>
              {isDemoUser && <p className="text-xs text-muted-foreground text-center">Sign up with a real account to create posts</p>}
            </div>
          ) : (
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-muted-foreground" size={32} />
                </div>
              ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                  <ImageIcon size={48} strokeWidth={1} />
                  <p className="text-sm font-medium">No posts yet</p>
                  <button onClick={() => setTab('create')} className="text-accent text-sm font-semibold">Create your first post</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post.id} className="rounded-xl border border-border bg-card overflow-hidden">
                      {/* Post media */}
                      {post.post_media.length > 0 && (
                        <div className="relative aspect-video bg-secondary">
                          <img
                            src={post.post_media[0].media_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          {post.post_media.length > 1 && (
                            <span className="absolute top-2 right-2 rounded-full bg-foreground/70 px-2 py-0.5 text-xs text-background font-medium">
                              +{post.post_media.length - 1}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Post info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{post.caption || <span className="text-muted-foreground italic">No caption</span>}</p>
                            {post.location && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <MapPin size={12} /> {post.location}
                              </p>
                            )}
                            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                              <span>❤️ {post.likes.length}</span>
                              <span>💬 {post.comments.length}</span>
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Actions menu */}
                          <div className="relative">
                            <button
                              onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
                              className="p-1 rounded-lg hover:bg-secondary"
                            >
                              <MoreHorizontal size={20} className="text-muted-foreground" />
                            </button>
                            {menuOpenId === post.id && (
                              <div className="absolute right-0 top-8 z-10 rounded-lg border border-border bg-card shadow-lg py-1 min-w-[140px]">
                                <button
                                  onClick={() => handleEdit(post)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary"
                                >
                                  <Edit3 size={14} /> Edit
                                </button>
                                <button
                                  onClick={() => { setDeleteConfirmId(post.id); setMenuOpenId(null); }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary text-destructive"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <BottomNav />

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4"
            onClick={() => setEditingPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-xl bg-card border border-border overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <button onClick={() => setEditingPost(null)}><X size={22} /></button>
                <h3 className="font-display font-bold text-sm">Edit Post</h3>
                <button onClick={handleSaveEdit} disabled={saving} className="text-sm font-semibold text-accent disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                </button>
              </div>
              <div className="p-4 space-y-4">
                {editingPost.post_media.length > 0 && (
                  <img src={editingPost.post_media[0].media_url} alt="" className="w-full rounded-lg aspect-video object-cover" />
                )}
                <textarea
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  placeholder="Edit caption..."
                  rows={3}
                  className="w-full rounded-lg bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-muted-foreground" />
                  <input
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    placeholder="Edit location"
                    className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-xl bg-card border border-border p-6 text-center"
            >
              <Trash2 size={32} className="mx-auto text-destructive mb-3" />
              <h3 className="font-bold text-lg mb-2">Delete Post?</h3>
              <p className="text-sm text-muted-foreground mb-6">This action cannot be undone. The post and all its media will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 rounded-lg border border-border py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 rounded-lg bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Create;
