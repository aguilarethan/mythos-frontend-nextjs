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

export interface UpdateProfileRequest {
    username: string; 
    email: string;
}

export interface WriterProfileRequest {
  name: string;
  lastName: string;
  birthDate: string; // ISO format string
  country: string;
  biography: string;
}

export interface BecomeWriterResponse {
  message: string;
}