import inquirer from 'inquirer';
import lm from '../utils/localizationManager';

export class AuthPrompts {
  public async mainMenu(): Promise<string> {
    const { choice } = await inquirer.prompt([{
      type: 'list', name: 'choice', message: lm.get('welcome'),
      choices: [lm.get('auth.login'), lm.get('auth.signup'), lm.get('auth.exit')],
    }]);
    return choice;
  }
  public async forSignup(): Promise<any> {
    return inquirer.prompt([
      { type: 'input', name: 'username', message: lm.get('auth.promptUsername') },
      { type: 'input', name: 'email', message: lm.get('auth.promptEmail') },
      { type: 'password', name: 'password', message: lm.get('auth.promptPassword'), mask: '*' },
    ]);
  }
  public async forLogin(): Promise<any> {
    return inquirer.prompt([
      { type: 'input', name: 'email', message: lm.get('auth.promptEmail') },
      { type: 'password', name: 'password', message: lm.get('auth.promptPassword'), mask: '*' },
    ]);
  }
}