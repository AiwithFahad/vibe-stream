-- Drop existing FK that points to auth.users and recreate pointing to profiles
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
ALTER TABLE public.posts
  ADD CONSTRAINT posts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- comments
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE public.comments
  ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- likes
ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_user_id_fkey;
ALTER TABLE public.likes
  ADD CONSTRAINT likes_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- followers
ALTER TABLE public.followers DROP CONSTRAINT IF EXISTS followers_follower_id_fkey;
ALTER TABLE public.followers
  ADD CONSTRAINT followers_follower_id_fkey
  FOREIGN KEY (follower_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.followers DROP CONSTRAINT IF EXISTS followers_following_id_fkey;
ALTER TABLE public.followers
  ADD CONSTRAINT followers_following_id_fkey
  FOREIGN KEY (following_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- saved_posts
ALTER TABLE public.saved_posts DROP CONSTRAINT IF EXISTS saved_posts_user_id_fkey;
ALTER TABLE public.saved_posts
  ADD CONSTRAINT saved_posts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- notifications
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_actor_id_fkey;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_actor_id_fkey
  FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- stories
ALTER TABLE public.stories DROP CONSTRAINT IF EXISTS stories_user_id_fkey;
ALTER TABLE public.stories
  ADD CONSTRAINT stories_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- story_viewers
ALTER TABLE public.story_viewers DROP CONSTRAINT IF EXISTS story_viewers_viewer_id_fkey;
ALTER TABLE public.story_viewers
  ADD CONSTRAINT story_viewers_viewer_id_fkey
  FOREIGN KEY (viewer_id) REFERENCES public.profiles(id) ON DELETE CASCADE