export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  phoneNumberVerifiedAt: string | null;
  latitude: number;
  longitude: number;
}

