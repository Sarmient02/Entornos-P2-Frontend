export interface LoginRTA {
    id: number;
    email: string;
    username: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
}

export interface RegisterForm {
    username: string;
    password: string;
    email: string;
    student_code: string;
    full_name: string;
}