
import { authApi } from '../api';
import { setState } from '../state';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, User } from '../types/auth.types';
import logger from '../config/logger';
import lm from '../utils/localizationManager';
import { AuthPrompts } from '../ui/authPrompts';
import { CommonPrompts } from '../ui/commonPrompts';

export class AuthFlow {
  private prompts = new AuthPrompts();
  private commonPrompts = new CommonPrompts();

  public async handleSignup(): Promise<void> {
    logger.info(lm.get('auth.signupTitle'));
    try {
      const answers = await this.prompts.forSignup();
      const newUser = await authApi.signupUser(answers);
      logger.info(lm.get('auth.signupSuccess', { username: newUser.username }));
      await this.commonPrompts.toContinue();
    } catch (error: any) {
      // The API layer already logs the error, so we just pause for user
      await this.commonPrompts.toContinue();
    }
  }

  public async handleLogin(): Promise<User | null> {
    logger.info(lm.get('auth.loginTitle'));
    try {
      const credentials = await this.prompts.forLogin();
      const { token } = await authApi.loginUser(credentials);
      const decoded = jwtDecode<DecodedToken>(token);
      const user = decoded.user;

      setState({ token, user });
      logger.info(lm.get('auth.loginSuccess'));
      return user;
    } catch (error: any) {
      // The API layer logs the error, return null to signal failure
      await this.commonPrompts.toContinue();
      return null;
    }
  }

  public async startInitialMenu(): Promise<User | null> {
    const choice = await this.prompts.mainMenu();
    switch (choice) {
      case lm.get('auth.login'):
        return this.handleLogin();
      case lm.get('auth.signup'):
        await this.handleSignup();
        return null; // Return to main menu after signup
      case lm.get('auth.exit'):
        logger.info(lm.get('goodbye'));
        process.exit(0);
    }
    return null;
  }
}