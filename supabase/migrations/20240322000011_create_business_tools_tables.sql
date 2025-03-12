-- Create business_inventory table
CREATE TABLE IF NOT EXISTS public.business_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity FLOAT NOT NULL,
  unit TEXT NOT NULL,
  cost_per_unit FLOAT NOT NULL,
  supplier TEXT,
  reorder_point FLOAT,
  last_restock_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create business_calculations table
CREATE TABLE IF NOT EXISTS public.business_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_name TEXT NOT NULL,
  product_size FLOAT NOT NULL,
  product_unit TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  labor_cost FLOAT NOT NULL,
  packaging_cost FLOAT NOT NULL,
  overhead_cost FLOAT NOT NULL,
  target_margin FLOAT NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create business_financial_records table
CREATE TABLE IF NOT EXISTS public.business_financial_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  record_date DATE NOT NULL,
  record_type TEXT NOT NULL, -- 'revenue', 'expense'
  category TEXT NOT NULL,
  amount FLOAT NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.business_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_financial_records ENABLE ROW LEVEL SECURITY;

-- Create policies for business_inventory
DROP POLICY IF EXISTS "Users can view their own inventory" ON public.business_inventory;
CREATE POLICY "Users can view their own inventory"
  ON public.business_inventory FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own inventory" ON public.business_inventory;
CREATE POLICY "Users can insert their own inventory"
  ON public.business_inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own inventory" ON public.business_inventory;
CREATE POLICY "Users can update their own inventory"
  ON public.business_inventory FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own inventory" ON public.business_inventory;
CREATE POLICY "Users can delete their own inventory"
  ON public.business_inventory FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for business_calculations
DROP POLICY IF EXISTS "Users can view their own calculations" ON public.business_calculations;
CREATE POLICY "Users can view their own calculations"
  ON public.business_calculations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own calculations" ON public.business_calculations;
CREATE POLICY "Users can insert their own calculations"
  ON public.business_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own calculations" ON public.business_calculations;
CREATE POLICY "Users can update their own calculations"
  ON public.business_calculations FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own calculations" ON public.business_calculations;
CREATE POLICY "Users can delete their own calculations"
  ON public.business_calculations FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for business_financial_records
DROP POLICY IF EXISTS "Users can view their own financial records" ON public.business_financial_records;
CREATE POLICY "Users can view their own financial records"
  ON public.business_financial_records FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own financial records" ON public.business_financial_records;
CREATE POLICY "Users can insert their own financial records"
  ON public.business_financial_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own financial records" ON public.business_financial_records;
CREATE POLICY "Users can update their own financial records"
  ON public.business_financial_records FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own financial records" ON public.business_financial_records;
CREATE POLICY "Users can delete their own financial records"
  ON public.business_financial_records FOR DELETE
  USING (auth.uid() = user_id);

-- Set up Realtime
alter publication supabase_realtime add table public.business_inventory;
alter publication supabase_realtime add table public.business_calculations;
alter publication supabase_realtime add table public.business_financial_records;
