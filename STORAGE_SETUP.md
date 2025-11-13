# Supabase Storage Setup Guide

## Creating the Storage Bucket

1. **Navigate to Storage**
   - Go to your Supabase project dashboard
   - Click on **Storage** in the left sidebar

2. **Create New Bucket**
   - Click **New bucket**
   - Name: `issue-images`
   - **Important:** Uncheck "Private bucket" (make it public)
   - Click **Create bucket**

## Setting Up Storage Policies

After creating the bucket, you need to set up policies for access control.

### Policy 1: Public Read Access

**Policy Name:** "Anyone can view images"

- **Operation:** SELECT
- **Policy definition:**
  ```sql
  true
  ```
- **Description:** Allows anyone to view images (public bucket)

### Policy 2: Authenticated Upload

**Policy Name:** "Authenticated users can upload images"

- **Operation:** INSERT
- **Policy definition:**
  ```sql
  bucket_id = 'issue-images' AND auth.role() = 'authenticated'
  ```
- **Description:** Only authenticated users can upload images

### Policy 3: User Delete Own Images

**Policy Name:** "Users can delete their own images"

- **Operation:** DELETE
- **Policy definition:**
  ```sql
  bucket_id = 'issue-images' AND auth.uid()::text = (storage.foldername(name))[1]
  ```
- **Description:** Users can only delete images they uploaded (based on filename containing their user ID)

## Alternative: Using Supabase Dashboard UI

1. Go to **Storage** → **Policies** → Select `issue-images` bucket
2. Click **New Policy**
3. For each policy above:
   - Enter the policy name
   - Select the operation (SELECT, INSERT, DELETE)
   - Paste the policy definition
   - Click **Review** then **Save policy**

## Testing Storage

After setup, you can test by:

1. Uploading an image through the ReportIssueModal
2. Checking the Storage bucket to see if the file appears
3. Verifying the image URL is accessible

## Troubleshooting

### "Storage bucket not found" error
- Verify the bucket name is exactly `issue-images`
- Check that the bucket exists in your Supabase project

### "Permission denied" error
- Verify the storage policies are set correctly
- Ensure the user is authenticated
- Check that the bucket is public (for viewing)

### Image not displaying
- Verify the image URL is correct
- Check that the bucket is public
- Ensure the SELECT policy allows viewing

