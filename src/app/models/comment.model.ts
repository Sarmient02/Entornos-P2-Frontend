import { UserPost } from "./user.model";

export interface Comment {
    id: number;
    body: string;
    createdAt: Date;
    postId: number;
    user: UserPost;
    score: number;
}

export interface newComment {
    id: number;
    body: string;
    createdAt: Date;
    postId: number;
    userId: number;
    score: number;
}