-- Create public logos bucket if missing
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Allow anyone to read logos
create policy "Public read logos"
  on storage.objects for select
  using (bucket_id = 'logos');

-- Allow authenticated users to upload to their own folder (userId/...)
create policy "Users can upload logos to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'logos'
    and auth.uid() = owner
    and position(auth.uid()::text || '/' in name) = 1
  );

-- Allow owners to update/delete their own uploads
create policy "Users manage their own logos"
  on storage.objects for update
  using (
    bucket_id = 'logos'
    and auth.uid() = owner
    and position(auth.uid()::text || '/' in name) = 1
  );

create policy "Users delete their own logos"
  on storage.objects for delete
  using (
    bucket_id = 'logos'
    and auth.uid() = owner
    and position(auth.uid()::text || '/' in name) = 1
  );
