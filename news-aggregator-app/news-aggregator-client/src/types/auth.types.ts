
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'User' | 'Admin';
}

export interface AppState {
  token: string | null;
  user: User | null;
}

export interface DecodedToken {
  user: {
    id: string;
    role: 'User' | 'Admin';
    username: string;
    email: string;
  };
  iat: number;
  exp: number;
}