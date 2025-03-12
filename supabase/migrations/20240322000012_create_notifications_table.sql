-- Create a unified notifications table for all modules
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES marketplace_orders(id) ON DELETE SET NULL,
  course_id UUID REFERENCES learning_courses(id) ON DELETE SET NULL,
  thread_id UUID REFERENCES forum_threads(id) ON DELETE SET NULL,
  reference_id VARCHAR(255) -- Generic reference ID for any other entity
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON user_notifications(type);

-- Enable row-level security
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON user_notifications;
CREATE POLICY "Users can view their own notifications"
  ON user_notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON user_notifications;
CREATE POLICY "Users can update their own notifications"
  ON user_notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON user_notifications;
CREATE POLICY "Users can delete their own notifications"
  ON user_notifications FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON user_notifications;
CREATE POLICY "System can insert notifications"
  ON user_notifications FOR INSERT
  WITH CHECK (true);

-- Enable realtime subscriptions for this table
ALTER PUBLICATION supabase_realtime ADD TABLE user_notifications;
