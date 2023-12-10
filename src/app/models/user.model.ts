export interface User {
    id: number;
    email: string;
    username: string;
    roles: string[];
}

export interface newUser {
    username: string;
    password: string;
    student_code: string;
    full_name: string;
    email: string;
}

export interface updateUser {
    id: number;
    username: string;
    password: string;
    student_code: string;
    full_name: string;
    email: string;
    roles: string[];
}

export interface UserPost {
    id: number;
    username: string;
    fullName: string;
}