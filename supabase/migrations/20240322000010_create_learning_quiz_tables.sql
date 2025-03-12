-- Create learning_quiz_questions table
CREATE TABLE IF NOT EXISTS public.learning_quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.learning_lessons(id) NOT NULL,
  course_id UUID REFERENCES public.learning_courses(id) NOT NULL,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create learning_quiz_attempts table
CREATE TABLE IF NOT EXISTS public.learning_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  lesson_id UUID REFERENCES public.learning_lessons(id) NOT NULL,
  course_id UUID REFERENCES public.learning_courses(id) NOT NULL,
  score FLOAT NOT NULL,
  passed BOOLEAN DEFAULT false,
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create learning_time_tracking table
CREATE TABLE IF NOT EXISTS public.learning_time_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  lesson_id UUID REFERENCES public.learning_lessons(id) NOT NULL,
  course_id UUID REFERENCES public.learning_courses(id) NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.learning_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_time_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_quiz_questions
DROP POLICY IF EXISTS "Users can view quiz questions" ON public.learning_quiz_questions;
CREATE POLICY "Users can view quiz questions"
  ON public.learning_quiz_questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can insert quiz questions" ON public.learning_quiz_questions;
CREATE POLICY "Only admins can insert quiz questions"
  ON public.learning_quiz_questions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.membership_type = 'admin'
  ));

DROP POLICY IF EXISTS "Only admins can update quiz questions" ON public.learning_quiz_questions;
CREATE POLICY "Only admins can update quiz questions"
  ON public.learning_quiz_questions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.membership_type = 'admin'
  ));

DROP POLICY IF EXISTS "Only admins can delete quiz questions" ON public.learning_quiz_questions;
CREATE POLICY "Only admins can delete quiz questions"
  ON public.learning_quiz_questions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.membership_type = 'admin'
  ));

-- Create policies for learning_quiz_attempts
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.learning_quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts"
  ON public.learning_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON public.learning_quiz_attempts;
CREATE POLICY "Users can insert their own quiz attempts"
  ON public.learning_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for learning_time_tracking
DROP POLICY IF EXISTS "Users can view their own time tracking" ON public.learning_time_tracking;
CREATE POLICY "Users can view their own time tracking"
  ON public.learning_time_tracking FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own time tracking" ON public.learning_time_tracking;
CREATE POLICY "Users can insert their own time tracking"
  ON public.learning_time_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Set up Realtime
alter publication supabase_realtime add table public.learning_quiz_questions;
alter publication supabase_realtime add table public.learning_quiz_attempts;
alter publication supabase_realtime add table public.learning_time_tracking;
