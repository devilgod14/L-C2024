import { AppState } from './types/auth.types'; 

let state: AppState = {
  token: null,
  user: null,
};

export const setState = (newState: Partial<AppState>): void => {
  state = { ...state, ...newState };
};

export const getState = (): AppState => {
  return state;
};