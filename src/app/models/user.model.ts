export interface User {
    id: number;
    email: string;
    username: string;
    roles: string[];
}

export interface newUser {
    username: string;
    password: string;
    fullName: string;
    studentCode: string;
    email: string;
}