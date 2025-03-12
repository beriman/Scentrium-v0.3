-- Create forum threads table
CREATE TABLE IF NOT EXISTS public.forum_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  views INT NOT NULL DEFAULT 0,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  flag_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  flag_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create votes table to track user votes
CREATE TABLE IF NOT EXISTS public.forum_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT thread_or_reply_check CHECK (
    (thread_id IS NULL AND reply_id IS NOT NULL) OR
    (thread_id IS NOT NULL AND reply_id IS NULL)
  ),
  CONSTRAINT unique_thread_vote UNIQUE (user_id, thread_id),
  CONSTRAINT unique_reply_vote UNIQUE (user_id, reply_id)
);

-- Create reports table for content moderation
CREATE TABLE IF NOT EXISTS public.forum_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'rejected', 'actioned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT thread_or_reply_report_check CHECK (
    (thread_id IS NULL AND reply_id IS NOT NULL) OR
    (thread_id IS NOT NULL AND reply_id IS NULL)
  )
);

-- Create user experience points table
CREATE TABLE IF NOT EXISTS public.user_exp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  total_exp INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  daily_exp_gained INT NOT NULL DEFAULT 0,
  exp_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  required_exp INT,
  required_level INT,
  required_action TEXT,
  required_count INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  badge_id UUID NOT NULL REFERENCES public.badges(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- Insert default badges
INSERT INTO public.badges (name, description, icon, required_level, required_exp, required_action, required_count)
VALUES
  ('Newbie', 'Just getting started', 'user', 1, 0, NULL, NULL),
  ('Explorer', 'Reached level 2', 'compass', 2, 100, NULL, NULL),
  ('Enthusiast', 'Reached level 3', 'star', 3, 500, NULL, NULL),
  ('Expert', 'Reached level 4', 'award', 4, 1000, NULL, NULL),
  ('Master Perfumer', 'Reached level 5', 'crown', 5, 5000, NULL, NULL),
  ('Thread Starter', 'Created 5 threads', 'message-square', NULL, NULL, 'thread_create', 5),
  ('Helpful Member', 'Received 50 upvotes', 'thumbs-up', NULL, NULL, 'upvotes_received', 50),
  ('Active Contributor', 'Posted 20 replies', 'message-circle', NULL, NULL, 'reply_create', 20);

-- Create function to update user EXP when voting
CREATE OR REPLACE FUNCTION update_user_exp_on_vote()
RETURNS TRIGGER AS $$
DECLARE
  content_author_id UUID;
  exp_limit INT;
  current_date_val DATE := CURRENT_DATE;
  membership_type TEXT;
BEGIN
  -- Get the membership type to determine daily EXP limit
  SELECT p.membership_type INTO membership_type
  FROM profiles p
  WHERE p.id = NEW.user_id;
  
  -- Set EXP limit based on membership type
  IF membership_type = 'business' THEN
    exp_limit := 500;
  ELSE
    exp_limit := 100;
  END IF;
  
  -- Check if user has reached daily EXP limit
  DECLARE
    current_daily_exp INT;
  BEGIN
    -- Get or create user_exp record
    INSERT INTO user_exp (user_id, daily_exp_gained, exp_reset_date)
    VALUES (NEW.user_id, 0, current_date_val)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Get current daily EXP
    SELECT 
      CASE 
        WHEN exp_reset_date < current_date_val THEN 0
        ELSE daily_exp_gained
      END INTO current_daily_exp
    FROM user_exp
    WHERE user_id = NEW.user_id;
    
    -- Reset daily EXP if it's a new day
    IF (SELECT exp_reset_date FROM user_exp WHERE user_id = NEW.user_id) < current_date_val THEN
      UPDATE user_exp
      SET daily_exp_gained = 0, exp_reset_date = current_date_val
      WHERE user_id = NEW.user_id;
      
      current_daily_exp := 0;
    END IF;
    
    -- Check if user can gain more EXP today
    IF current_daily_exp >= exp_limit THEN
      -- User has reached daily limit, don't add EXP
      RETURN NEW;
    END IF;
  END;
  
  -- Add EXP to voter (1 EXP for voting)
  UPDATE user_exp
  SET 
    total_exp = total_exp + 1,
    daily_exp_gained = daily_exp_gained + 1,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  -- Get content author ID
  IF NEW.thread_id IS NOT NULL THEN
    SELECT author_id INTO content_author_id
    FROM forum_threads
    WHERE id = NEW.thread_id;
  ELSE
    SELECT author_id INTO content_author_id
    FROM forum_replies
    WHERE id = NEW.reply_id;
  END IF;
  
  -- Add or subtract EXP from content author based on vote type
  IF NEW.vote_type = 'upvote' THEN
    -- Check author's daily EXP limit
    DECLARE
      author_daily_exp INT;
      author_membership_type TEXT;
      author_exp_limit INT;
    BEGIN
      -- Get author's membership type
      SELECT p.membership_type INTO author_membership_type
      FROM profiles p
      WHERE p.id = content_author_id;
      
      -- Set author's EXP limit
      IF author_membership_type = 'business' THEN
        author_exp_limit := 500;
      ELSE
        author_exp_limit := 100;
      END IF;
      
      -- Get or create author's user_exp record
      INSERT INTO user_exp (user_id, daily_exp_gained, exp_reset_date)
      VALUES (content_author_id, 0, current_date_val)
      ON CONFLICT (user_id) DO NOTHING;
      
      -- Get author's current daily EXP
      SELECT 
        CASE 
          WHEN exp_reset_date < current_date_val THEN 0
          ELSE daily_exp_gained
        END INTO author_daily_exp
      FROM user_exp
      WHERE user_id = content_author_id;
      
      -- Reset author's daily EXP if it's a new day
      IF (SELECT exp_reset_date FROM user_exp WHERE user_id = content_author_id) < current_date_val THEN
        UPDATE user_exp
        SET daily_exp_gained = 0, exp_reset_date = current_date_val
        WHERE user_id = content_author_id;
        
        author_daily_exp := 0;
      END IF;
      
      -- Check if author can gain more EXP today
      IF author_daily_exp < author_exp_limit THEN
        -- Add 1 EXP to content author for receiving upvote
        UPDATE user_exp
        SET 
          total_exp = total_exp + 1,
          daily_exp_gained = daily_exp_gained + 1,
          updated_at = now()
        WHERE user_id = content_author_id;
      END IF;
    END;
  ELSIF NEW.vote_type = 'downvote' THEN
    -- Subtract 1 EXP from content author for receiving downvote
    UPDATE user_exp
    SET 
      total_exp = GREATEST(0, total_exp - 1),
      updated_at = now()
    WHERE user_id = content_author_id;
  END IF;
  
  -- Update user level based on total EXP
  UPDATE user_exp
  SET level = 
    CASE
      WHEN total_exp >= 5000 THEN 5
      WHEN total_exp >= 1000 THEN 4
      WHEN total_exp >= 500 THEN 3
      WHEN total_exp >= 100 THEN 2
      ELSE 1
    END
  WHERE user_id IN (NEW.user_id, content_author_id);
  
  -- Check and award badges based on level
  INSERT INTO user_badges (user_id, badge_id)
  SELECT ue.user_id, b.id
  FROM user_exp ue, badges b
  WHERE ue.user_id IN (NEW.user_id, content_author_id)
    AND b.required_level IS NOT NULL
    AND ue.level >= b.required_level
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub
      WHERE ub.user_id = ue.user_id AND ub.badge_id = b.id
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for votes
CREATE TRIGGER update_exp_on_vote
AFTER INSERT ON forum_votes
FOR EACH ROW
EXECUTE FUNCTION update_user_exp_on_vote();

-- Create function to update user EXP when creating thread
CREATE OR REPLACE FUNCTION update_user_exp_on_thread_create()
RETURNS TRIGGER AS $$
DECLARE
  exp_limit INT;
  current_date_val DATE := CURRENT_DATE;
  membership_type TEXT;
  current_daily_exp INT;
  thread_count INT;
BEGIN
  -- Get the membership type to determine daily EXP limit
  SELECT p.membership_type INTO membership_type
  FROM profiles p
  WHERE p.id = NEW.author_id;
  
  -- Set EXP limit based on membership type
  IF membership_type = 'business' THEN
    exp_limit := 500;
  ELSE
    exp_limit := 100;
  END IF;
  
  -- Get or create user_exp record
  INSERT INTO user_exp (user_id, daily_exp_gained, exp_reset_date)
  VALUES (NEW.author_id, 0, current_date_val)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Get current daily EXP
  SELECT 
    CASE 
      WHEN exp_reset_date < current_date_val THEN 0
      ELSE daily_exp_gained
    END INTO current_daily_exp
  FROM user_exp
  WHERE user_id = NEW.author_id;
  
  -- Reset daily EXP if it's a new day
  IF (SELECT exp_reset_date FROM user_exp WHERE user_id = NEW.author_id) < current_date_val THEN
    UPDATE user_exp
    SET daily_exp_gained = 0, exp_reset_date = current_date_val
    WHERE user_id = NEW.author_id;
    
    current_daily_exp := 0;
  END IF;
  
  -- Check if user can gain more EXP today
  IF current_daily_exp < exp_limit THEN
    -- Add 1 EXP for creating a thread
    UPDATE user_exp
    SET 
      total_exp = total_exp + 1,
      daily_exp_gained = daily_exp_gained + 1,
      updated_at = now()
    WHERE user_id = NEW.author_id;
  END IF;
  
  -- Update user level based on total EXP
  UPDATE user_exp
  SET level = 
    CASE
      WHEN total_exp >= 5000 THEN 5
      WHEN total_exp >= 1000 THEN 4
      WHEN total_exp >= 500 THEN 3
      WHEN total_exp >= 100 THEN 2
      ELSE 1
    END
  WHERE user_id = NEW.author_id;
  
  -- Check and award badges based on level
  INSERT INTO user_badges (user_id, badge_id)
  SELECT ue.user_id, b.id
  FROM user_exp ue, badges b
  WHERE ue.user_id = NEW.author_id
    AND b.required_level IS NOT NULL
    AND ue.level >= b.required_level
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub
      WHERE ub.user_id = ue.user_id AND ub.badge_id = b.id
    );
  
  -- Count user's threads and award badge if applicable
  SELECT COUNT(*) INTO thread_count
  FROM forum_threads
  WHERE author_id = NEW.author_id;
  
  IF thread_count >= 5 THEN
    INSERT INTO user_badges (user_id, badge_id)
    SELECT NEW.author_id, b.id
    FROM badges b
    WHERE b.name = 'Thread Starter'
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub
      WHERE ub.user_id = NEW.author_id AND ub.badge_id = b.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for thread creation
CREATE TRIGGER update_exp_on_thread_create
AFTER INSERT ON forum_threads
FOR EACH ROW
EXECUTE FUNCTION update_user_exp_on_thread_create();

-- Create function to update user EXP when creating reply
CREATE OR REPLACE FUNCTION update_user_exp_on_reply_create()
RETURNS TRIGGER AS $$
DECLARE
  exp_limit INT;
  current_date_val DATE := CURRENT_DATE;
  membership_type TEXT;
  current_daily_exp INT;
  reply_count INT;
BEGIN
  -- Get the membership type to determine daily EXP limit
  SELECT p.membership_type INTO membership_type
  FROM profiles p
  WHERE p.id = NEW.author_id;
  
  -- Set EXP limit based on membership type
  IF membership_type = 'business' THEN
    exp_limit := 500;
  ELSE
    exp_limit := 100;
  END IF;
  
  -- Get or create user_exp record
  INSERT INTO user_exp (user_id, daily_exp_gained, exp_reset_date)
  VALUES (NEW.author_id, 0, current_date_val)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Get current daily EXP
  SELECT 
    CASE 
      WHEN exp_reset_date < current_date_val THEN 0
      ELSE daily_exp_gained
    END INTO current_daily_exp
  FROM user_exp
  WHERE user_id = NEW.author_id;
  
  -- Reset daily EXP if it's a new day
  IF (SELECT exp_reset_date FROM user_exp WHERE user_id = NEW.author_id) < current_date_val THEN
    UPDATE user_exp
    SET daily_exp_gained = 0, exp_reset_date = current_date_val
    WHERE user_id = NEW.author_id;
    
    current_daily_exp := 0;
  END IF;
  
  -- Check if user can gain more EXP today
  IF current_daily_exp < exp_limit THEN
    -- Add 1 EXP for creating a reply
    UPDATE user_exp
    SET 
      total_exp = total_exp + 1,
      daily_exp_gained = daily_exp_gained + 1,
      updated_at = now()
    WHERE user_id = NEW.author_id;
  END IF;
  
  -- Update user level based on total EXP
  UPDATE user_exp
  SET level = 
    CASE
      WHEN total_exp >= 5000 THEN 5
      WHEN total_exp >= 1000 THEN 4
      WHEN total_exp >= 500 THEN 3
      WHEN total_exp >= 100 THEN 2
      ELSE 1
    END
  WHERE user_id = NEW.author_id;
  
  -- Check and award badges based on level
  INSERT INTO user_badges (user_id, badge_id)
  SELECT ue.user_id, b.id
  FROM user_exp ue, badges b
  WHERE ue.user_id = NEW.author_id
    AND b.required_level IS NOT NULL
    AND ue.level >= b.required_level
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub
      WHERE ub.user_id = ue.user_id AND ub.badge_id = b.id
    );
  
  -- Count user's replies and award badge if applicable
  SELECT COUNT(*) INTO reply_count
  FROM forum_replies
  WHERE author_id = NEW.author_id;
  
  IF reply_count >= 20 THEN
    INSERT INTO user_badges (user_id, badge_id)
    SELECT NEW.author_id, b.id
    FROM badges b
    WHERE b.name = 'Active Contributor'
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub
      WHERE ub.user_id = NEW.author_id AND ub.badge_id = b.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reply creation
CREATE TRIGGER update_exp_on_reply_create
AFTER INSERT ON forum_replies
FOR EACH ROW
EXECUTE FUNCTION update_user_exp_on_reply_create();

-- Create function to handle content reporting
CREATE OR REPLACE FUNCTION handle_content_report()
RETURNS TRIGGER AS $$
DECLARE
  report_count INT;
BEGIN
  -- Count existing reports for this content
  IF NEW.thread_id IS NOT NULL THEN
    SELECT COUNT(*) INTO report_count
    FROM forum_reports
    WHERE thread_id = NEW.thread_id AND status = 'pending';
    
    -- Auto-flag thread if it has 3 or more pending reports
    IF report_count >= 3 THEN
      UPDATE forum_threads
      SET is_flagged = true, flag_reason = 'Multiple user reports'
      WHERE id = NEW.thread_id;
    END IF;
  ELSE
    SELECT COUNT(*) INTO report_count
    FROM forum_reports
    WHERE reply_id = NEW.reply_id AND status = 'pending';
    
    -- Auto-flag reply if it has 3 or more pending reports
    IF report_count >= 3 THEN
      UPDATE forum_replies
      SET is_flagged = true, flag_reason = 'Multiple user reports'
      WHERE id = NEW.reply_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for content reporting
CREATE TRIGGER handle_content_report
AFTER INSERT ON forum_reports
FOR EACH ROW
EXECUTE FUNCTION handle_content_report();

-- Create function to check and award upvote badges
CREATE OR REPLACE FUNCTION check_upvote_badges()
RETURNS TRIGGER AS $$
DECLARE
  content_author_id UUID;
  total_upvotes INT;
BEGIN
  -- Only proceed for upvotes
  IF NEW.vote_type != 'upvote' THEN
    RETURN NEW;
  END IF;
  
  -- Get content author ID
  IF NEW.thread_id IS NOT NULL THEN
    SELECT author_id INTO content_author_id
    FROM forum_threads
    WHERE id = NEW.thread_id;
  ELSE
    SELECT author_id INTO content_author_id
    FROM forum_replies
    WHERE id = NEW.reply_id;
  END IF;
  
  -- Count total upvotes received by the author
  SELECT 
    COUNT(*) INTO total_upvotes
  FROM forum_votes v
  LEFT JOIN forum_threads t ON v.thread_id = t.id
  LEFT JOIN forum_replies r ON v.reply_id = r.id
  WHERE v.vote_type = 'upvote'
  AND (
    (t.author_id = content_author_id AND v.thread_id IS NOT NULL) OR
    (r.author_id = content_author_id AND v.reply_id IS NOT NULL)
  );
  
  -- Award badge if applicable
  IF total_upvotes >= 50 THEN
    INSERT INTO user_badges (user_id, badge_id)
    SELECT content_author_id, b.id
    FROM badges b
    WHERE b.name = 'Helpful Member'
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub
      WHERE ub.user_id = content_author_id AND ub.badge_id = b.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for upvote badge checking
CREATE TRIGGER check_upvote_badges
AFTER INSERT ON forum_votes
FOR EACH ROW
EXECUTE FUNCTION check_upvote_badges();

-- Enable row level security
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Forum threads policies
DROP POLICY IF EXISTS "Anyone can view threads" ON public.forum_threads;
CREATE POLICY "Anyone can view threads"
  ON public.forum_threads FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create threads" ON public.forum_threads;
CREATE POLICY "Authenticated users can create threads"
  ON public.forum_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own threads" ON public.forum_threads;
CREATE POLICY "Users can update their own threads"
  ON public.forum_threads FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own threads" ON public.forum_threads;
CREATE POLICY "Users can delete their own threads"
  ON public.forum_threads FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Forum replies policies
DROP POLICY IF EXISTS "Anyone can view replies" ON public.forum_replies;
CREATE POLICY "Anyone can view replies"
  ON public.forum_replies FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.forum_replies;
CREATE POLICY "Authenticated users can create replies"
  ON public.forum_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own replies" ON public.forum_replies;
CREATE POLICY "Users can update their own replies"
  ON public.forum_replies FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own replies" ON public.forum_replies;
CREATE POLICY "Users can delete their own replies"
  ON public.forum_replies FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Forum votes policies
DROP POLICY IF EXISTS "Users can view votes" ON public.forum_votes;
CREATE POLICY "Users can view votes"
  ON public.forum_votes FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can create votes" ON public.forum_votes;
CREATE POLICY "Users can create votes"
  ON public.forum_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own votes" ON public.forum_votes;
CREATE POLICY "Users can update their own votes"
  ON public.forum_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own votes" ON public.forum_votes;
CREATE POLICY "Users can delete their own votes"
  ON public.forum_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Forum reports policies
DROP POLICY IF EXISTS "Authenticated users can create reports" ON public.forum_reports;
CREATE POLICY "Authenticated users can create reports"
  ON public.forum_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON public.forum_reports;
CREATE POLICY "Users can view their own reports"
  ON public.forum_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- User exp policies
DROP POLICY IF EXISTS "Users can view their own exp" ON public.user_exp;
CREATE POLICY "Users can view their own exp"
  ON public.user_exp FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Badges policies
DROP POLICY IF EXISTS "Anyone can view badges" ON public.badges;
CREATE POLICY "Anyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

-- User badges policies
DROP POLICY IF EXISTS "Users can view their own badges" ON public.user_badges;
CREATE POLICY "Users can view their own badges"
  ON public.user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table forum_threads;
alter publication supabase_realtime add table forum_replies;
alter publication supabase_realtime add table forum_votes;
alter publication supabase_realtime add table forum_reports;
alter publication supabase_realtime add table user_exp;
alter publication supabase_realtime add table badges;
alter publication supabase_realtime add table user_badges;
