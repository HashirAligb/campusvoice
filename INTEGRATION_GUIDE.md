# CampusVoice Issue Reporting Integration Guide

This guide will help you set up the Reddit-style issue reporting feature in your CampusVoice application.

## Prerequisites

- Supabase project set up
- Environment variables configured (`.env` file)
- Node.js and npm installed

## Step 1: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase_schema.sql`
4. Run the SQL script
5. Verify that the following tables were created:
   - `profiles`
   - `issues`
   - `issue_votes`

## Step 2: Set Up Supabase Storage

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it: `issue-images`
4. Set it to **Public bucket** (uncheck "Private bucket")
5. Click **Create bucket**

### Storage Policies

After creating the bucket, set up the following policies:

1. Go to **Storage** → **Policies** → `issue-images`
2. Add the following policy:

**Policy Name:** "Anyone can view images"
- Operation: SELECT
- Policy definition: `true`

**Policy Name:** "Authenticated users can upload images"
- Operation: INSERT
- Policy definition: `bucket_id = 'issue-images' AND auth.role() = 'authenticated'`

**Policy Name:** "Users can delete their own images"
- Operation: DELETE
- Policy definition: `bucket_id = 'issue-images' AND auth.uid()::text = (storage.foldername(name))[1]`

## Step 3: Verify Environment Variables

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the Home page
3. Click **Report New Issue**
4. Fill out the form and submit
5. Verify the issue appears in the feed

## Features Implemented

### ✅ ReportIssueModal Component
- Form validation (required fields)
- Image upload with 5MB limit
- Auto-populates school and category from filters
- Success/error feedback

### ✅ PostCard Component
- Reddit-style upvote/downvote system
- Expandable descriptions
- Status badges
- Time formatting ("2h ago")
- Image display

### ✅ Feed Component
- Fetches issues from Supabase
- Applies school and category filters
- Loading and error states
- Auto-refreshes on updates

### ✅ Database Integration
- Issues table with proper schema
- Vote tracking system
- Row Level Security (RLS) policies
- Automatic vote count updates via triggers

## Troubleshooting

### Issues not appearing
- Check browser console for errors
- Verify RLS policies are set correctly
- Ensure you're authenticated

### Image upload fails
- Verify storage bucket exists and is public
- Check storage policies
- Ensure file size is under 5MB

### Voting not working
- Check that `issue_votes` table exists
- Verify RLS policies allow voting
- Ensure user is authenticated

### TypeScript errors
- Run `npm run build` to check for type errors
- Ensure all imports are correct
- Check that types match the database schema

## Database Schema Reference

### Issues Table
- `id`: UUID (primary key)
- `title`: TEXT (required)
- `description`: TEXT (required)
- `school`: TEXT (required)
- `category`: TEXT (required)
- `status`: TEXT (default: 'open')
- `image_url`: TEXT (nullable)
- `upvotes`: INTEGER (default: 0)
- `downvotes`: INTEGER (default: 0)
- `author_id`: UUID (foreign key to auth.users)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Issue Votes Table
- `id`: UUID (primary key)
- `issue_id`: UUID (foreign key to issues)
- `user_id`: UUID (foreign key to auth.users)
- `vote_type`: TEXT ('upvote' or 'downvote')
- `created_at`: TIMESTAMP

## Next Steps

- Add pagination for large issue lists
- Implement issue comments
- Add issue editing functionality
- Create admin panel for status management
- Add search functionality

