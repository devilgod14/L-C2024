import inquirer from 'inquirer';
import lm from '../utils/localizationManager';
import { requiredInput } from '../utils/validator';

export class NotificationPrompts {
  public async forNotificationAction(): Promise<string> {
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: lm.get('notifications.menuTitle'),
      choices: [
        lm.get('notifications.view'),
        lm.get('notifications.configure'),
        lm.get('headlines.goBack'),
      ],
    });
    return choice;
  }

  public async forConfiguration(currentSettings: { enabledCategories: string[], keywords: string[] }, allCategories: string[]): Promise<{ enabledCategories: string[], keywords: string[] }> {
    const { newCategories } = await inquirer.prompt({
      type: 'checkbox',
      name: 'newCategories',
      message: lm.get('notifications.configurePrompt'),
      choices: allCategories,
      default: currentSettings.enabledCategories,
    });
    
    const { keywords } = await inquirer.prompt({
      type: 'input',
      name: 'keywords',
      message: lm.get('notifications.keywordsPrompt'),
      validate: requiredInput,
      default: currentSettings.keywords.join(', '),
    });

    return {
      enabledCategories: newCategories,
      keywords: keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k)
    };
  }
}