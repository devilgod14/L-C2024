import inquirer from 'inquirer';
import lm from '../utils/localizationManager';

export class InteractionPrompts {
  public async forArticleAction(): Promise<string> {
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: lm.get('articleActions.prompt'),
      choices: [
        lm.get('articleActions.like'),
        lm.get('articleActions.dislike'),
        lm.get('articleActions.save'),
        lm.get('articleActions.report'),
        lm.get('headlines.goBack')
      ]
    });
    return choice;
  }

  public async forArticleId(action: string): Promise<string> {
    const { articleId } = await inquirer.prompt({
      type: 'input',
      name: 'articleId',
      message: lm.get('articleActions.promptId', { action })
    });
    return articleId;
  }

  public async forSavedArticleAction(): Promise<string> {
    const { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: lm.get('articleActions.prompt'),
        choices: [lm.get('saved.delete'), lm.get('headlines.goBack')]
    });
    return choice;
  }

  public async forSavedArticleIdToDelete(): Promise<string> {
    const { articleId } = await inquirer.prompt({
        type: 'input',
        name: 'articleId',
        message: lm.get('saved.promptId')
    });
    return articleId;
  }
}