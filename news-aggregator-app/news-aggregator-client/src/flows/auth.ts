import { promptForSignup, promptForLogin } from '../ui/prompts.js';
import { signupUser,loginUser } from '../api/api.js';
import { setState, User } from '../state.js';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user: User;
  iat: number;
  exp: number;
}

export const handleSignup = async () => {
  try {
    const answers = await promptForSignup();
    const newUser = await signupUser(answers);
    console.log(`\n✅ Success! User '${newUser.username}' was created successfully.`);
    console.log('You can now log in.');
  } catch (error :any) {
    const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
    console.error(`\n❌ Error: ${errorMessage}`);
  }
};

export const handleLogin = async (): Promise<User | null> => {
  try {
    const credentials = await promptForLogin();
    const { token } = await loginUser(credentials);
    const decoded = jwtDecode<DecodedToken>(token);
    setState({ token: token, user: decoded.user });

    console.log(`\n✅ Login Successful! Welcome, ${decoded.user.role}.`);
    return decoded.user;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
    console.error(`\n❌ Error: ${errorMessage}`);
    return null;
  }
};