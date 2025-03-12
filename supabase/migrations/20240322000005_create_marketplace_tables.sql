-- Create marketplace_orders table
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  product_id UUID NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_method TEXT,
  tracking_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'payment_confirmed', 'shipped', 'delivered', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_proof TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create marketplace_products table
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  stock INT NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  size TEXT NOT NULL,
  condition TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'out_of_stock', 'hidden', 'deleted')),
  views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create marketplace_product_images table
CREATE TABLE IF NOT EXISTS marketplace_product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create marketplace_reviews table
CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES marketplace_orders(id),
  product_id UUID NOT NULL REFERENCES marketplace_products(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create marketplace_notifications table
CREATE TABLE IF NOT EXISTS marketplace_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_id UUID REFERENCES marketplace_orders(id),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create marketplace_shipping_addresses table
CREATE TABLE IF NOT EXISTS marketplace_shipping_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  recipient_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create marketplace_payment_info table for storing admin payment information
CREATE TABLE IF NOT EXISTS marketplace_payment_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create marketplace_order_history table for tracking order status changes
CREATE TABLE IF NOT EXISTS marketplace_order_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES marketplace_orders(id),
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
-- Enable row level security
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_payment_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_order_history ENABLE ROW LEVEL SECURITY;

-- Create policies for marketplace_orders
DROP POLICY IF EXISTS "Users can view their own orders" ON marketplace_orders;
CREATE POLICY "Users can view their own orders"
  ON marketplace_orders
  FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Buyers can create orders" ON marketplace_orders;
CREATE POLICY "Buyers can create orders"
  ON marketplace_orders
  FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Buyers can update their own orders" ON marketplace_orders;
CREATE POLICY "Buyers can update their own orders"
  ON marketplace_orders
  FOR UPDATE
  USING (auth.uid() = buyer_id)
  WITH CHECK (status IN ('pending', 'delivered') AND 
             (CASE 
                WHEN status = 'pending' THEN status IN ('cancelled', 'pending') AND payment_proof IS NOT NULL
                WHEN status = 'delivered' THEN status = 'completed'
                ELSE false
              END));

DROP POLICY IF EXISTS "Sellers can update their own orders" ON marketplace_orders;
CREATE POLICY "Sellers can update their own orders"
  ON marketplace_orders
  FOR UPDATE
  USING (auth.uid() = seller_id)
  WITH CHECK (status = 'payment_confirmed' AND status = 'shipped' AND tracking_number IS NOT NULL);

-- Create policies for marketplace_products
DROP POLICY IF EXISTS "Anyone can view active products" ON marketplace_products;
CREATE POLICY "Anyone can view active products"
  ON marketplace_products
  FOR SELECT
  USING (status IN ('active', 'out_of_stock'));

DROP POLICY IF EXISTS "Sellers can view all their products" ON marketplace_products;
CREATE POLICY "Sellers can view all their products"
  ON marketplace_products
  FOR SELECT
  USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can create products" ON marketplace_products;
CREATE POLICY "Sellers can create products"
  ON marketplace_products
  FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can update their products" ON marketplace_products;
CREATE POLICY "Sellers can update their products"
  ON marketplace_products
  FOR UPDATE
  USING (auth.uid() = seller_id);

-- Create policies for marketplace_product_images
DROP POLICY IF EXISTS "Anyone can view product images" ON marketplace_product_images;
CREATE POLICY "Anyone can view product images"
  ON marketplace_product_images
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Sellers can manage their product images" ON marketplace_product_images;
CREATE POLICY "Sellers can manage their product images"
  ON marketplace_product_images
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM marketplace_products
    WHERE marketplace_products.id = marketplace_product_images.product_id
    AND marketplace_products.seller_id = auth.uid()
  ));

-- Create policies for marketplace_reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON marketplace_reviews;
CREATE POLICY "Anyone can view reviews"
  ON marketplace_reviews
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Buyers can create reviews for completed orders" ON marketplace_reviews;
CREATE POLICY "Buyers can create reviews for completed orders"
  ON marketplace_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = buyer_id AND 
             EXISTS (
               SELECT 1 FROM marketplace_orders
               WHERE marketplace_orders.id = marketplace_reviews.order_id
               AND marketplace_orders.status = 'completed'
               AND marketplace_orders.buyer_id = auth.uid()
             ));

-- Create policies for marketplace_notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON marketplace_notifications;
CREATE POLICY "Users can view their own notifications"
  ON marketplace_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON marketplace_notifications;
CREATE POLICY "Users can update their own notifications"
  ON marketplace_notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for marketplace_shipping_addresses
DROP POLICY IF EXISTS "Users can view their own shipping addresses" ON marketplace_shipping_addresses;
CREATE POLICY "Users can view their own shipping addresses"
  ON marketplace_shipping_addresses
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own shipping addresses" ON marketplace_shipping_addresses;
CREATE POLICY "Users can manage their own shipping addresses"
  ON marketplace_shipping_addresses
  FOR ALL
  USING (auth.uid() = user_id);

-- Create policies for marketplace_payment_info
DROP POLICY IF EXISTS "Anyone can view active payment info" ON marketplace_payment_info;
CREATE POLICY "Anyone can view active payment info"
  ON marketplace_payment_info
  FOR SELECT
  USING (is_active = true);

-- Create policies for marketplace_order_history
DROP POLICY IF EXISTS "Users can view history of their own orders" ON marketplace_order_history;
CREATE POLICY "Users can view history of their own orders"
  ON marketplace_order_history
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM marketplace_orders
    WHERE marketplace_orders.id = marketplace_order_history.order_id
    AND (marketplace_orders.buyer_id = auth.uid() OR marketplace_orders.seller_id = auth.uid())
  ));

-- Create functions for order processing
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE marketplace_products
  SET views = views + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check stock and update when order is created
CREATE OR REPLACE FUNCTION check_and_update_stock()
RETURNS TRIGGER AS $$
DECLARE
  current_stock INT;
BEGIN
  -- Get current stock
  SELECT stock INTO current_stock
  FROM marketplace_products
  WHERE id = NEW.product_id;
  
  -- Check if enough stock
  IF current_stock < NEW.quantity THEN
    RAISE EXCEPTION 'Not enough stock available';
  END IF;
  
  -- Update stock
  UPDATE marketplace_products
  SET 
    stock = stock - NEW.quantity,
    status = CASE WHEN (stock - NEW.quantity) <= 0 THEN 'out_of_stock' ELSE status END,
    updated_at = NOW()
  WHERE id = NEW.product_id;
  
  -- Create order history entry
  INSERT INTO marketplace_order_history
    (order_id, previous_status, new_status, changed_by, notes)
  VALUES
    (NEW.id, NULL, NEW.status, NEW.buyer_id, 'Order created');
  
  -- Create notification for seller
  INSERT INTO marketplace_notifications
    (user_id, order_id, type, message)
  VALUES
    (NEW.seller_id, NEW.id, 'new_order', 'You have received a new order');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to track order status changes
CREATE OR REPLACE FUNCTION track_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  buyer_id UUID;
  seller_id UUID;
  order_quantity INT;
  order_product_id UUID;
BEGIN
  -- Only proceed if status has changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get buyer and seller IDs and other order details
  SELECT o.buyer_id, o.seller_id, o.quantity, o.product_id 
  INTO buyer_id, seller_id, order_quantity, order_product_id
  FROM marketplace_orders o
  WHERE o.id = NEW.id;
  
  -- Create order history entry
  INSERT INTO marketplace_order_history
    (order_id, previous_status, new_status, changed_by, notes)
  VALUES
    (NEW.id, OLD.status, NEW.status, auth.uid(), 'Status updated');
  
  -- Create notifications based on status change
  CASE NEW.status
    WHEN 'payment_confirmed' THEN
      -- Notify seller that payment is confirmed
      INSERT INTO marketplace_notifications
        (user_id, order_id, type, message)
      VALUES
        (seller_id, NEW.id, 'payment_confirmed', 'Payment for your order has been confirmed. Please ship the product.');
    
    WHEN 'shipped' THEN
      -- Notify buyer that order has been shipped
      INSERT INTO marketplace_notifications
        (user_id, order_id, type, message)
      VALUES
        (buyer_id, NEW.id, 'order_shipped', 'Your order has been shipped. Tracking number: ' || COALESCE(NEW.tracking_number, 'Not provided'));
    
    WHEN 'delivered' THEN
      -- Notify seller that buyer marked as delivered
      INSERT INTO marketplace_notifications
        (user_id, order_id, type, message)
      VALUES
        (seller_id, NEW.id, 'order_delivered', 'Buyer has confirmed delivery of the order');
    
    WHEN 'completed' THEN
      -- Notify seller that order is completed and payment will be processed
      INSERT INTO marketplace_notifications
        (user_id, order_id, type, message)
      VALUES
        (seller_id, NEW.id, 'order_completed', 'Order has been completed. Payment will be processed to your account.');
      
      -- Notify buyer that order is completed
      INSERT INTO marketplace_notifications
        (user_id, order_id, type, message)
      VALUES
        (buyer_id, NEW.id, 'order_completed', 'Your order has been completed. Thank you for your purchase!');
    
    WHEN 'cancelled' THEN
      -- Notify seller that order is cancelled
      INSERT INTO marketplace_notifications
        (user_id, order_id, type, message)
      VALUES
        (seller_id, NEW.id, 'order_cancelled', 'An order has been cancelled');
      
      -- Return stock to product
      UPDATE marketplace_products
      SET 
        stock = stock + order_quantity,
        status = CASE WHEN status = 'out_of_stock' AND (stock + order_quantity) > 0 THEN 'active' ELSE status END,
        updated_at = NOW()
      WHERE id = order_product_id;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS on_order_created ON marketplace_orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON marketplace_orders
  FOR EACH ROW
  EXECUTE FUNCTION check_and_update_stock();

DROP TRIGGER IF EXISTS on_order_status_change ON marketplace_orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE OF status ON marketplace_orders
  FOR EACH ROW
  EXECUTE FUNCTION track_order_status_change();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE marketplace_notifications;

-- Insert default payment information
INSERT INTO marketplace_payment_info (bank_name, account_number, account_name)
VALUES ('Bank Mandiri', '1234567890', 'Scentrium Rekening Bersama');
