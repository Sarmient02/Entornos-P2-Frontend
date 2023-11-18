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
    username: string;
    password: string;
    student_code: string;
    full_name: string;
    email: string;
    roles: string[];
}