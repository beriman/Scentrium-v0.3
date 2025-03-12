-- Create learning_user_progress table
CREATE TABLE IF NOT EXISTS public.learning_user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  course_id UUID REFERENCES public.learning_courses(id) NOT NULL,
  lesson_id UUID REFERENCES public.learning_lessons(id) NOT NULL,
  completed BOOLEAN DEFAULT false,
  quiz_completed BOOLEAN DEFAULT false,
  last_position FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable row level security
ALTER TABLE public.learning_user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own progress";
CREATE POLICY "Users can view their own progress"
  ON public.learning_user_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress";
CREATE POLICY "Users can update their own progress"
  ON public.learning_user_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress";
CREATE POLICY "Users can insert their own progress"
  ON public.learning_user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Set up Realtime
alter publication supabase_realtime add table public.learning_user_progress;

-- Add role column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END
$$;