
-- Fix overly permissive notifications INSERT policy
DROP POLICY "Notifications can be created" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = actor_id);
