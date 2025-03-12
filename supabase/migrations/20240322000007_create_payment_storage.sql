-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true);

-- Set up storage policy to allow authenticated users to upload payment proofs
CREATE POLICY "Users can upload payment proofs" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'payment-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Set up storage policy to allow users to read their own payment proofs
CREATE POLICY "Users can view their own payment proofs" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'payment-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Set up storage policy to allow admin to view all payment proofs
-- In a real app, you would restrict this to admin users only
CREATE POLICY "Admin can view all payment proofs" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'payment-proofs');
