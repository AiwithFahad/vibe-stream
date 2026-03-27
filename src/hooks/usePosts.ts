import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PostWithDetails {
  id: string;
  user_id: string;
  caption: string;
  location: string;
  hashtags: string[];
  created_at: string;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
    display_name: string | null;
  };
  post_media: { id: string; media_url: string; media_type: string; sort_order: number }[];
  likes: { user_id: string }[];
  comments: { id: string }[];
  saved_posts: { user_id: string }[];
}

export const usePosts = (userId?: string) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey (id, username, avatar_url, display_name),
        post_media (id, media_url, media_type, sort_order),
        likes (user_id),
        comments (id),
        saved_posts (user_id)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (!error && data) {
      setPosts(data as unknown as PostWithDetails[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const isLiked = post.likes.some(l => l.user_id === user.id);

    if (isLiked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
    }

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        likes: isLiked
          ? p.likes.filter(l => l.user_id !== user.id)
          : [...p.likes, { user_id: user.id }],
      };
    }));
  };

  const toggleSave = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const isSaved = post.saved_posts.some(s => s.user_id === user.id);

    if (isSaved) {
      await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id });
    }

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        saved_posts: isSaved
          ? p.saved_posts.filter(s => s.user_id !== user.id)
          : [...p.saved_posts, { user_id: user.id }],
      };
    }));
  };

  const deletePost = async (postId: string) => {
    await supabase.from('posts').delete().eq('id', postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return { posts, loading, fetchPosts, toggleLike, toggleSave, deletePost };
};
