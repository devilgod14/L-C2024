import inquirer from 'inquirer';
import lm from '../utils/localizationManager';

export class NewsPrompts {
  public async forDateOption(): Promise<string> {
    const { choice } = await inquirer.prompt([{
        type: 'list', name: 'choice', message: lm.get('headlines.dateOptionPrompt'),
        choices: [lm.get('headlines.today'), lm.get('headlines.dateRange'), lm.get('headlines.goBack')]
    }]);
    return choice;
  }

  public async forDate(messageKey: 'promptStartDate' | 'promptEndDate'): Promise<string> {
    const { date } = await inquirer.prompt([{ type: 'input', name: 'date', message: lm.get(`headlines.${messageKey}`) }]);
    return date;
  }

  public async forCategory(categories: string[]): Promise<string> {
    const { choice } = await inquirer.prompt([{
        type: 'list', name: 'choice', message: lm.get('headlines.categoryPrompt'),
        choices: [lm.get('headlines.allCategories'), ...categories]
    }]);
    return choice;
  }

  public async forSearchQuery(): Promise<string> {
    const { query } = await inquirer.prompt([{ type: 'input', name: 'query', message: lm.get('search.promptQuery') }]);
    return query;
  }

  public async forSortOption(): Promise<string> {
    const { choice } = await inquirer.prompt([{
      type: 'list', name: 'choice', message: lm.get('search.promptSort'),
      choices: [
        { name: lm.get('search.sortNewest'), value: 'publishedAt' },
        { name: lm.get('search.sortLikes'), value: 'likes' },
        { name: lm.get('search.sortDislikes'), value: 'dislikes' },
      ],
    }]);
    
    return choice;
  }
}