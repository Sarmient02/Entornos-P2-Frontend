import { FileP } from "./file.model";
import { Subject } from "./subject.model";
import { UserPost } from "./user.model";

export interface Post {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    files: FileP[];
    user: UserPost;
    subject: Subject;
}

export interface newPost {
    title: string;
    description: string;
    subjectId: number;
}

export interface updatePost {
    id: number;
    title: string;
    description: string;
    subject: Subject;
    files: String[];
}