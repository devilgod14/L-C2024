
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'User' | 'Admin';
}

interface AppState {
  token: string | null;
  user: User | null;
}

let state: AppState = {
  token: null,
  user: null,
};

export const setState = (newState: Partial<AppState>) => {
  state = { ...state, ...newState };
};

export const getState = (): AppState => {
  return state;
};