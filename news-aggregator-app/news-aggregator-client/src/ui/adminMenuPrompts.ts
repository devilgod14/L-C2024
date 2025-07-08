import inquirer from 'inquirer';
import lm from '../utils/localizationManager';
import { requiredInput } from '../utils/validator';

export class AdminMenuPrompts {
  public async main(): Promise<string> {
    const { choice } = await inquirer.prompt({
      type: 'list', name: 'choice', message: lm.get('adminMenu.title'),
      choices: [
        lm.get('adminMenu.viewServers'), lm.get('adminMenu.manageReports'),
        lm.get('adminMenu.manageCategories'), lm.get('adminMenu.manageKeywords'),
        lm.get('adminMenu.addCategory'), lm.get('userMenu.logout'),
      ],
    });
    return choice;
  }

  public async forServerAction(): Promise<string> {
    const { choice } = await inquirer.prompt({
      type: 'list', name: 'choice', message: lm.get('admin.sourcesActionPrompt'),
      choices: [
          lm.get('admin.viewDetails'), 
          lm.get('admin.updateKey'),
          lm.get('headlines.goBack')
      ]
    });
    return choice;
  }

    public async forSourceId(action: string): Promise<string> {
    const { sourceId } = await inquirer.prompt({
      type: 'input', name: 'sourceId', message: lm.get('adminMenu.promptSourceId', { action }),validate: requiredInput
    });
    return sourceId;
  }

  public async forSourceUpdate(): Promise<{ sourceId: string, apiKey: string }> {
    return inquirer.prompt([
      { type: 'input', name: 'sourceId', message: lm.get('admin.promptSourceId', { action: 'update' }),validate: requiredInput },
      { type: 'input', name: 'apiKey', message: lm.get('admin.promptNewKey'),validate: requiredInput },
    ]);
  }

  public async forReportAction(): Promise<string> {
    const { choice } = await inquirer.prompt({
        type: 'list', name: 'choice', message: lm.get('admin.reportActionPrompt'),
        choices: [lm.get('admin.hideArticle'), lm.get('headlines.goBack')]
    });
    return choice;
  }

  public async forArticleIdToHide(): Promise<string> {
    const { articleId } = await inquirer.prompt({
        type: 'input', name: 'articleId', message: lm.get('admin.promptArticleId'),validate: requiredInput
    });
    return articleId;
  }

  public async forCategoryManagement(): Promise<string> {
    const { choice } = await inquirer.prompt({
      type: 'list', name: 'choice', message: lm.get('admin.categoryActionPrompt'),
      choices: [lm.get('admin.hideCategory'), lm.get('admin.unhideCategory'), lm.get('headlines.goBack')]
    });
    return choice;
  }

  public async forCategoryId(action: string): Promise<string> {
    const { categoryId } = await inquirer.prompt({
      type: 'input', name: 'categoryId', message: lm.get('admin.promptCategoryId', { action }),validate: requiredInput
    });
    return categoryId;
  }
  
  public async forKeywordManagement(): Promise<string> {
    const { choice } = await inquirer.prompt({
      type: 'list', name: 'choice', message: lm.get('admin.keywordActionPrompt'),
      choices: [
        lm.get('admin.viewKeywords'), lm.get('admin.addKeyword'),
        lm.get('admin.removeKeyword'), lm.get('headlines.goBack')
      ]
    });
    return choice;
  }
  
  public async forNewKeyword(): Promise<string> {
    const { keyword } = await inquirer.prompt([{ type: 'input', name: 'keyword', message: lm.get('admin.promptNewKeyword'),validate: requiredInput }]);
    return keyword;
  }

  public async forKeywordIdToRemove(): Promise<string> {
    const { keywordId } = await inquirer.prompt([{ type: 'input', name: 'keywordId', message: lm.get('admin.promptRemoveKeywordId'),validate: requiredInput }]);
    return keywordId;
  }

  public async forNewCategory(): Promise<string> {
    const { name } = await inquirer.prompt([{ type: 'input', name: 'name', message: lm.get('admin.promptNewCatName'),validate: requiredInput }]);
    return name;
  }
}