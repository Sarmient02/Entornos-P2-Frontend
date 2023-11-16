export interface LoginRTA {
    id: number;
    email: string;
    username: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
}