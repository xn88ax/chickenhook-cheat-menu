ALTER TABLE public.shouts ADD COLUMN IF NOT EXISTS attachment_url text;
CREATE POLICY "chat_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'chat');
CREATE POLICY "chat_user_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'chat' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "chat_user_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'chat' AND (storage.foldername(name))[1] = auth.uid()::text);