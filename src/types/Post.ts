export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Issue {
    id: string;
    title: string;
    description: string;
    school: string;
    category: string;
    status: IssueStatus;
    image_url: string | null;
    upvotes: number;
    downvotes: number;
    created_at: string;
    updated_at: string;
    author_id: string;
    author?: {
        id: string;
        username: string | null;
        firstname: string | null;
        lastname: string | null;
    };
    user_vote?: 'upvote' | 'downvote' | null;
}

export interface CreateIssueInput {
    title: string;
    description: string;
    school: string;
    category: string;
    image?: File | null;
}
