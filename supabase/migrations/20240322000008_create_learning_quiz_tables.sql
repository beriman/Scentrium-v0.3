-- Create quiz questions table
CREATE TABLE IF NOT EXISTS learning_quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES learning_courses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz attempts table to track user quiz attempts
CREATE TABLE IF NOT EXISTS learning_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES learning_courses(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time tracking table to track time spent on lessons
CREATE TABLE IF NOT EXISTS learning_time_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES learning_courses(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add quiz_completed field to user progress table
ALTER TABLE learning_user_progress
ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT FALSE;

-- Enable RLS on new tables
ALTER TABLE learning_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_time_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz questions
DROP POLICY IF EXISTS "Quiz questions are viewable by everyone" ON learning_quiz_questions;
CREATE POLICY "Quiz questions are viewable by everyone"
  ON learning_quiz_questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Quiz questions are editable by admins" ON learning_quiz_questions;
CREATE POLICY "Quiz questions are editable by admins"
  ON learning_quiz_questions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Create policies for quiz attempts
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON learning_quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts"
  ON learning_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON learning_quiz_attempts;
CREATE POLICY "Users can insert their own quiz attempts"
  ON learning_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all quiz attempts" ON learning_quiz_attempts;
CREATE POLICY "Admins can view all quiz attempts"
  ON learning_quiz_attempts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Create policies for time tracking
DROP POLICY IF EXISTS "Users can view their own time tracking" ON learning_time_tracking;
CREATE POLICY "Users can view their own time tracking"
  ON learning_time_tracking FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own time tracking" ON learning_time_tracking;
CREATE POLICY "Users can insert their own time tracking"
  ON learning_time_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all time tracking" ON learning_time_tracking;
CREATE POLICY "Admins can view all time tracking"
  ON learning_time_tracking FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Add realtime for all tables
alter publication supabase_realtime add table learning_quiz_questions;
alter publication supabase_realtime add table learning_quiz_attempts;
alter publication supabase_realtime add table learning_time_tracking;
