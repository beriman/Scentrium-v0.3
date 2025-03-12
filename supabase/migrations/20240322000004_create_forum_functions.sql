-- Create function to get upvotes received by a user
CREATE OR REPLACE FUNCTION get_user_upvotes_received(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  thread_upvotes INTEGER;
  reply_upvotes INTEGER;
  total_upvotes INTEGER;
BEGIN
  -- Count upvotes on threads
  SELECT COALESCE(SUM(upvotes), 0) INTO thread_upvotes
  FROM forum_threads
  WHERE author_id = user_id_param;
  
  -- Count upvotes on replies
  SELECT COALESCE(SUM(upvotes), 0) INTO reply_upvotes
  FROM forum_replies
  WHERE author_id = user_id_param;
  
  -- Calculate total
  total_upvotes := thread_upvotes + reply_upvotes;
  
  RETURN total_upvotes;
END;
$$ LANGUAGE plpgsql;

-- Create increment function
CREATE OR REPLACE FUNCTION increment(x int)
RETURNS int AS $$
  SELECT x + 1;
$$ LANGUAGE SQL IMMUTABLE;

-- Create decrement function
CREATE OR REPLACE FUNCTION decrement(x int)
RETURNS int AS $$
  SELECT GREATEST(0, x - 1);
$$ LANGUAGE SQL IMMUTABLE;

-- Create function to begin transaction
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS VOID AS $$
BEGIN
  EXECUTE 'BEGIN';
END;
$$ LANGUAGE plpgsql;

-- Create function to commit transaction
CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS VOID AS $$
BEGIN
  EXECUTE 'COMMIT';
END;
$$ LANGUAGE plpgsql;

-- Create function to rollback transaction
CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS VOID AS $$
BEGIN
  EXECUTE 'ROLLBACK';
END;
$$ LANGUAGE plpgsql;
