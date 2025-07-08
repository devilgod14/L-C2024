import inquirer from 'inquirer';
import lm from '../utils/localizationManager';

export class UserMenuPrompts {
  public async main(): Promise<string> {
    const { choice } = await inquirer.prompt([{
      type: 'list', name: 'choice', message: lm.get('userMenu.title'),
      choices: [
        lm.get('userMenu.headlines'), lm.get('userMenu.savedArticles'),
        lm.get('userMenu.search'), lm.get('userMenu.notifications'),
        lm.get('userMenu.logout'),
      ],
    }]);
    return choice;
  }
}