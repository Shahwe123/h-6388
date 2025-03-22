
-- Update thread view count
CREATE OR REPLACE FUNCTION public.increment_thread_view_count(thread_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.forum_threads 
  SET view_count = view_count + 1 
  WHERE id = thread_id;
END;
$$;

-- Increment thread upvote count
CREATE OR REPLACE FUNCTION public.increment_thread_upvote_count(thread_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.forum_threads 
  SET upvotes = upvotes + 1 
  WHERE id = thread_id;
END;
$$;

-- Decrement thread upvote count
CREATE OR REPLACE FUNCTION public.decrement_thread_upvote_count(thread_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.forum_threads 
  SET upvotes = GREATEST(upvotes - 1, 0)
  WHERE id = thread_id;
END;
$$;

-- Increment comment upvote count
CREATE OR REPLACE FUNCTION public.increment_comment_upvote_count(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.thread_comments 
  SET upvotes = upvotes + 1 
  WHERE id = comment_id;
END;
$$;

-- Decrement comment upvote count
CREATE OR REPLACE FUNCTION public.decrement_comment_upvote_count(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.thread_comments 
  SET upvotes = GREATEST(upvotes - 1, 0)
  WHERE id = comment_id;
END;
$$;
