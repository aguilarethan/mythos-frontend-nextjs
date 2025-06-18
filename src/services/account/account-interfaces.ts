export interface Account {
    accountId: string;
    username: string;
    email: string;
    role: string;
    password: string;
}

export interface ChangePasswordRequest {
    newPassword: string; 
}