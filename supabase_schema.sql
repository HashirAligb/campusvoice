-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (if it doesn't exist from auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    firstname TEXT,
    lastname TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    school TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    image_url TEXT,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue_votes table
CREATE TABLE IF NOT EXISTS issue_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_issues_school ON issues(school);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_author_id ON issues(author_id);
CREATE INDEX IF NOT EXISTS idx_issue_votes_issue_id ON issue_votes(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_votes_user_id ON issue_votes(user_id);

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_issue_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'upvote' THEN
            UPDATE issues SET upvotes = upvotes + 1 WHERE id = NEW.issue_id;
        ELSIF NEW.vote_type = 'downvote' THEN
            UPDATE issues SET downvotes = downvotes + 1 WHERE id = NEW.issue_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'upvote' THEN
            UPDATE issues SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.issue_id;
        ELSIF OLD.vote_type = 'downvote' THEN
            UPDATE issues SET downvotes = GREATEST(0, downvotes - 1) WHERE id = OLD.issue_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Remove old vote
        IF OLD.vote_type = 'upvote' THEN
            UPDATE issues SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.issue_id;
        ELSIF OLD.vote_type = 'downvote' THEN
            UPDATE issues SET downvotes = GREATEST(0, downvotes - 1) WHERE id = OLD.issue_id;
        END IF;
        -- Add new vote
        IF NEW.vote_type = 'upvote' THEN
            UPDATE issues SET upvotes = upvotes + 1 WHERE id = NEW.issue_id;
        ELSIF NEW.vote_type = 'downvote' THEN
            UPDATE issues SET downvotes = downvotes + 1 WHERE id = NEW.issue_id;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for vote counts
DROP TRIGGER IF EXISTS trigger_update_vote_counts_insert ON issue_votes;
CREATE TRIGGER trigger_update_vote_counts_insert
    AFTER INSERT ON issue_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_issue_vote_counts();

DROP TRIGGER IF EXISTS trigger_update_vote_counts_delete ON issue_votes;
CREATE TRIGGER trigger_update_vote_counts_delete
    AFTER DELETE ON issue_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_issue_vote_counts();

DROP TRIGGER IF EXISTS trigger_update_vote_counts_update ON issue_votes;
CREATE TRIGGER trigger_update_vote_counts_update
    AFTER UPDATE ON issue_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_issue_vote_counts();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Issues policies
DROP POLICY IF EXISTS "Anyone can view issues" ON issues;
CREATE POLICY "Anyone can view issues" ON issues
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create issues" ON issues;
CREATE POLICY "Authenticated users can create issues" ON issues
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own issues" ON issues;
CREATE POLICY "Users can update their own issues" ON issues
    FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own issues" ON issues;
CREATE POLICY "Users can delete their own issues" ON issues
    FOR DELETE USING (auth.uid() = author_id);

-- Issue votes policies
DROP POLICY IF EXISTS "Anyone can view votes" ON issue_votes;
CREATE POLICY "Anyone can view votes" ON issue_votes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can vote" ON issue_votes;
CREATE POLICY "Authenticated users can vote" ON issue_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own votes" ON issue_votes;
CREATE POLICY "Users can delete their own votes" ON issue_votes
    FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own votes" ON issue_votes;
CREATE POLICY "Users can update their own votes" ON issue_votes
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, firstname, lastname)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'userName',
        NEW.raw_user_meta_data->>'firstName',
        NEW.raw_user_meta_data->>'lastName'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

