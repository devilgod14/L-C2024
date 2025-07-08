import inquirer from 'inquirer';
import lm from '../utils/localizationManager';

export class CommonPrompts {
    public async toContinue(): Promise<void> {
        await inquirer.prompt([{ type: 'input', name: 'continue', message: lm.get('pressEnter') }]);
    }
}