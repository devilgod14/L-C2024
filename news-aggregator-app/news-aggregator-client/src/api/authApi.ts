import api from './api.js'

interface Credentials {
  email: string;
  password: string;
}

interface UserData extends Credentials {
  username: string;
}

export const signupUser = async (userData: UserData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const loginUser = async (credentials: Credentials): Promise<{ token: string }> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};