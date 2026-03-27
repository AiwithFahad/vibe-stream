import { useState, useRef } from 'react';
import { X, Image as ImageIcon, MapPin, Hash, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const CreatePostModal = ({ open, onClose, onPostCreated }: CreatePostModalProps) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async () => {
    if (!user || files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    setPosting(true);

    try {
      // Create the post
      const hashtags = extractHashtags(caption);
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({ user_id: user.id, caption, location, hashtags })
        .select()
        .single();

      if (postError || !post) throw postError;

      // Upload media
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${post.id}/${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(path, file, { contentType: file.type });

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
      onPostCreated?.();
      resetAndClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const resetAndClose = () => {
    setFiles([]);
    setPreviews([]);
    setCaption('');
    setLocation('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl bg-card border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <button onClick={resetAndClose}><X size={22} /></button>
              <h3 className="font-display font-bold text-sm">Create new post</h3>
              <button
                onClick={handleSubmit}
                disabled={posting || files.length === 0}
                className="text-sm font-semibold text-accent disabled:opacity-50"
              >
                {posting ? <Loader2 size={16} className="animate-spin" /> : 'Share'}
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Media previews */}
              {previews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-foreground/70 flex items-center justify-center"
                      >
                        <X size={12} className="text-background" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-12 text-muted-foreground hover:border-accent transition-colors"
                >
                  <ImageIcon size={48} strokeWidth={1} />
                  <p className="text-sm font-medium">Drag photos and videos here</p>
                  <span className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
                    Select from computer
                  </span>
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFiles}
                className="hidden"
              />

              {previews.length > 0 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-accent font-semibold"
                >
                  + Add more
                </button>
              )}

              {/* Caption */}
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Write a caption... Use #hashtags"
                rows={3}
                className="w-full rounded-lg bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />

              {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-muted-foreground" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Add location"
                  className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {/* Hashtags preview */}
              {extractHashtags(caption).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {extractHashtags(caption).map(tag => (
                    <span key={tag} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
