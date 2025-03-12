-- Create learning_courses table
CREATE TABLE IF NOT EXISTS learning_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INT NOT NULL,
  instructor_id UUID REFERENCES profiles(id),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create learning_modules table
CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES learning_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_number INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create learning_lessons table
CREATE TABLE IF NOT EXISTS learning_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  order_number INT NOT NULL,
  related_product_id UUID REFERENCES marketplace_products(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create learning_enrollments table
CREATE TABLE IF NOT EXISTS learning_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID NOT NULL REFERENCES learning_courses(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  progress_percentage INT NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_proof TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create learning_progress table
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  lesson_id UUID NOT NULL REFERENCES learning_lessons(id),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_seconds INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Create learning_certificates table
CREATE TABLE IF NOT EXISTS learning_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID NOT NULL REFERENCES learning_courses(id),
  certificate_url TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create learning_badges table
CREATE TABLE IF NOT EXISTS learning_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  course_id UUID REFERENCES learning_courses(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_learning_badges table
CREATE TABLE IF NOT EXISTS user_learning_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  badge_id UUID NOT NULL REFERENCES learning_badges(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE learning_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_courses
DROP POLICY IF EXISTS "Anyone can view published courses" ON learning_courses;
CREATE POLICY "Anyone can view published courses"
  ON learning_courses
  FOR SELECT
  USING (status = 'published');

-- Create policies for learning_modules
DROP POLICY IF EXISTS "Anyone can view modules of published courses" ON learning_modules;
CREATE POLICY "Anyone can view modules of published courses"
  ON learning_modules
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM learning_courses
    WHERE learning_courses.id = learning_modules.course_id
    AND learning_courses.status = 'published'
  ));

-- Create policies for learning_lessons
DROP POLICY IF EXISTS "Anyone can view preview lessons" ON learning_lessons;
CREATE POLICY "Anyone can view preview lessons"
  ON learning_lessons
  FOR SELECT
  USING (is_preview = true);

DROP POLICY IF EXISTS "Enrolled users can view all lessons" ON learning_lessons;
CREATE POLICY "Enrolled users can view all lessons"
  ON learning_lessons
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM learning_enrollments
    JOIN learning_modules ON learning_modules.id = learning_lessons.module_id
    WHERE learning_enrollments.user_id = auth.uid()
    AND learning_enrollments.course_id = learning_modules.course_id
    AND learning_enrollments.payment_status = 'paid'
  ));

-- Create policies for learning_enrollments
DROP POLICY IF EXISTS "Users can view their own enrollments" ON learning_enrollments;
CREATE POLICY "Users can view their own enrollments"
  ON learning_enrollments
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own enrollments" ON learning_enrollments;
CREATE POLICY "Users can create their own enrollments"
  ON learning_enrollments
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own enrollments" ON learning_enrollments;
CREATE POLICY "Users can update their own enrollments"
  ON learning_enrollments
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for learning_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON learning_progress;
CREATE POLICY "Users can view their own progress"
  ON learning_progress
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own progress" ON learning_progress;
CREATE POLICY "Users can create their own progress"
  ON learning_progress
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own progress" ON learning_progress;
CREATE POLICY "Users can update their own progress"
  ON learning_progress
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for learning_certificates
DROP POLICY IF EXISTS "Users can view their own certificates" ON learning_certificates;
CREATE POLICY "Users can view their own certificates"
  ON learning_certificates
  FOR SELECT
  USING (user_id = auth.uid());

-- Create policies for learning_badges
DROP POLICY IF EXISTS "Anyone can view badges" ON learning_badges;
CREATE POLICY "Anyone can view badges"
  ON learning_badges
  FOR SELECT
  USING (true);

-- Create policies for user_learning_badges
DROP POLICY IF EXISTS "Users can view their own badges" ON user_learning_badges;
CREATE POLICY "Users can view their own badges"
  ON user_learning_badges
  FOR SELECT
  USING (user_id = auth.uid());

-- Create functions for learning platform
CREATE OR REPLACE FUNCTION check_course_completion()
RETURNS TRIGGER AS $$
DECLARE
  course_id UUID;
  total_lessons INT;
  completed_lessons INT;
  progress_percentage INT;
  badge_id UUID;
BEGIN
  -- Get the course_id from the lesson that was just completed
  SELECT learning_modules.course_id INTO course_id
  FROM learning_modules
  JOIN learning_lessons ON learning_lessons.module_id = learning_modules.id
  WHERE learning_lessons.id = NEW.lesson_id;
  
  -- Count total lessons in the course
  SELECT COUNT(*) INTO total_lessons
  FROM learning_lessons
  JOIN learning_modules ON learning_modules.id = learning_lessons.module_id
  WHERE learning_modules.course_id = course_id;
  
  -- Count completed lessons by the user in the course
  SELECT COUNT(*) INTO completed_lessons
  FROM learning_progress
  JOIN learning_lessons ON learning_lessons.id = learning_progress.lesson_id
  JOIN learning_modules ON learning_modules.id = learning_lessons.module_id
  WHERE learning_progress.user_id = NEW.user_id
  AND learning_modules.course_id = course_id
  AND learning_progress.status = 'completed';
  
  -- Calculate progress percentage
  progress_percentage := (completed_lessons * 100) / total_lessons;
  
  -- Update enrollment progress
  UPDATE learning_enrollments
  SET progress_percentage = progress_percentage,
      status = CASE WHEN progress_percentage = 100 THEN 'completed' ELSE status END,
      updated_at = NOW()
  WHERE user_id = NEW.user_id
  AND course_id = course_id;
  
  -- If course is completed, issue certificate and badge
  IF progress_percentage = 100 THEN
    -- Issue certificate if not already issued
    IF NOT EXISTS (
      SELECT 1 FROM learning_certificates
      WHERE user_id = NEW.user_id
      AND course_id = course_id
    ) THEN
      INSERT INTO learning_certificates (user_id, course_id, certificate_url)
      VALUES (NEW.user_id, course_id, 'https://example.com/certificates/' || course_id || '/' || NEW.user_id);
    END IF;
    
    -- Award course completion badge if exists and not already awarded
    SELECT id INTO badge_id
    FROM learning_badges
    WHERE course_id = course_id
    LIMIT 1;
    
    IF badge_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM user_learning_badges
      WHERE user_id = NEW.user_id
      AND badge_id = badge_id
    ) THEN
      INSERT INTO user_learning_badges (user_id, badge_id)
      VALUES (NEW.user_id, badge_id);
      
      -- Award EXP to user
      PERFORM award_exp_to_user(NEW.user_id, 100); -- Award 100 EXP for course completion
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to award EXP to user
CREATE OR REPLACE FUNCTION award_exp_to_user(user_id_param UUID, exp_amount INT)
RETURNS VOID AS $$
DECLARE
  current_date DATE := CURRENT_DATE;
  user_exp_record RECORD;
  daily_limit INT;
  available_daily_exp INT;
  actual_exp_to_award INT;
  new_total_exp INT;
  new_level INT;
BEGIN
  -- Get user's membership type to determine daily EXP limit
  SELECT CASE WHEN p.membership_type = 'business' THEN 500 ELSE 100 END INTO daily_limit
  FROM profiles p
  WHERE p.id = user_id_param;
  
  -- Get or create user_exp record
  SELECT * INTO user_exp_record
  FROM user_exp
  WHERE user_id = user_id_param;
  
  IF NOT FOUND THEN
    -- Create new user_exp record
    INSERT INTO user_exp (user_id, total_exp, level, daily_exp_gained, exp_reset_date)
    VALUES (user_id_param, 0, 1, 0, current_date)
    RETURNING * INTO user_exp_record;
  END IF;
  
  -- Check if exp_reset_date needs to be updated
  IF user_exp_record.exp_reset_date < current_date THEN
    -- Reset daily exp if it's a new day
    UPDATE user_exp
    SET daily_exp_gained = 0,
        exp_reset_date = current_date
    WHERE user_id = user_id_param;
    
    user_exp_record.daily_exp_gained := 0;
  END IF;
  
  -- Calculate available daily EXP
  available_daily_exp := daily_limit - user_exp_record.daily_exp_gained;
  
  -- Determine actual EXP to award (limited by daily cap)
  IF available_daily_exp <= 0 THEN
    -- Daily limit reached
    RETURN;
  ELSIF exp_amount > available_daily_exp THEN
    actual_exp_to_award := available_daily_exp;
  ELSE
    actual_exp_to_award := exp_amount;
  END IF;
  
  -- Calculate new total EXP and level
  new_total_exp := user_exp_record.total_exp + actual_exp_to_award;
  
  -- Calculate new level based on total EXP
  -- Level 1: 0 EXP
  -- Level 2: 100 EXP
  -- Level 3: 500 EXP
  -- Level 4: 1000 EXP
  -- Level 5: 5000 EXP
  IF new_total_exp >= 5000 THEN
    new_level := 5;
  ELSIF new_total_exp >= 1000 THEN
    new_level := 4;
  ELSIF new_total_exp >= 500 THEN
    new_level := 3;
  ELSIF new_total_exp >= 100 THEN
    new_level := 2;
  ELSE
    new_level := 1;
  END IF;
  
  -- Update user_exp record
  UPDATE user_exp
  SET total_exp = new_total_exp,
      level = new_level,
      daily_exp_gained = user_exp_record.daily_exp_gained + actual_exp_to_award,
      updated_at = NOW()
  WHERE user_id = user_id_param;
  
  -- Check if user earned a level badge
  IF new_level > user_exp_record.level THEN
    -- Award level badge if not already awarded
    FOR i IN user_exp_record.level + 1 .. new_level LOOP
      -- Find the level badge
      DECLARE
        level_badge_id UUID;
      BEGIN
        -- This assumes you have level badges with specific names
        SELECT id INTO level_badge_id
        FROM learning_badges
        WHERE name = 'Level ' || i
        LIMIT 1;
        
        IF level_badge_id IS NOT NULL AND NOT EXISTS (
          SELECT 1 FROM user_learning_badges
          WHERE user_id = user_id_param
          AND badge_id = level_badge_id
        ) THEN
          INSERT INTO user_learning_badges (user_id, badge_id)
          VALUES (user_id_param, level_badge_id);
        END IF;
      END;
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS on_lesson_completion ON learning_progress;
CREATE TRIGGER on_lesson_completion
  AFTER INSERT OR UPDATE OF status ON learning_progress
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION check_course_completion();

-- Insert default level badges
INSERT INTO learning_badges (name, description, icon)
VALUES 
  ('Level 1', 'Newbie - Reached Level 1', 'badge-level-1'),
  ('Level 2', 'Explorer - Reached Level 2', 'badge-level-2'),
  ('Level 3', 'Enthusiast - Reached Level 3', 'badge-level-3'),
  ('Level 4', 'Expert - Reached Level 4', 'badge-level-4'),
  ('Level 5', 'Master Perfumer - Reached Level 5', 'badge-level-5');

-- Enable realtime for learning_enrollments and learning_progress
ALTER PUBLICATION supabase_realtime ADD TABLE learning_enrollments;
ALTER PUBLICATION supabase_realtime ADD TABLE learning_progress;
