
import { UserFlows } from './flows/userFlows';
import { AdminFlows } from './flows/adminFlows';
import { NotificationFlows } from './flows/notificationFlows';
import { getState, setState } from './state';
import logger from './config/logger';
import lm from './utils/localizationManager';
import { AuthFlow } from './flows/authFlows';
import { UserMenuPrompts } from './ui/userMenuPrompts';
import { AdminMenuPrompts } from './ui/adminMenuPrompts';
import { CommonPrompts } from './ui/commonPrompts';

class App {
  private authFlow = new AuthFlow();
  private userFlows = new UserFlows();
  private adminFlows = new AdminFlows();
  private notificationFlows = new NotificationFlows();
  
  private userMenuPrompts = new UserMenuPrompts();
  private adminMenuPrompts = new AdminMenuPrompts();
  private commonPrompts = new CommonPrompts();

  private async showUserMenu(): Promise<void> {
    let inMenu = true;
    while (inMenu) {
      const choice = await this.userMenuPrompts.main();
      switch (choice) {
        case lm.get('userMenu.headlines'): await this.userFlows.handleHeadlines(); break;
        case lm.get('userMenu.savedArticles'): await this.userFlows.handleSavedArticles(); break;
        case lm.get('userMenu.search'): await this.userFlows.handleSearch(); break;
        case lm.get('userMenu.notifications'): await this.notificationFlows.start(); break;
        case lm.get('userMenu.logout'): inMenu = false; break;
      }
      if (inMenu) await this.commonPrompts.toContinue();
    }
  }

  private async showAdminMenu(): Promise<void> {
    let inMenu = true;
    while (inMenu) {
        const choice = await this.adminMenuPrompts.main();
        switch (choice) {
            case lm.get('adminMenu.viewServers'): await this.adminFlows.handleViewServers(); break;
            case lm.get('adminMenu.manageReports'): await this.adminFlows.handleManageReports(); break;
            case lm.get('adminMenu.manageCategories'): await this.adminFlows.handleManageCategories(); break;
            case lm.get('adminMenu.manageKeywords'): await this.adminFlows.handleManageKeywords(); break;
            case lm.get('adminMenu.addCategory'): await this.adminFlows.handleAddCategory(); break;
            case lm.get('userMenu.logout'): inMenu = false; break;
        }
        if (inMenu) await this.commonPrompts.toContinue();
    }
  }

  public async start(): Promise<void> {
    while (true) {
      let user = getState().user;
      
      if (!user) {
        await this.authFlow.startInitialMenu();
      } else {
        logger.info(lm.get('loggedInWelcome', { username: user.username }));
        if (user.role === 'Admin') {
          await this.showAdminMenu();
        } else {
          await this.showUserMenu();
        }

        setState({ token: null, user: null });
        logger.info(lm.get('loggedOut'));
      }
    }
  }
}

const app = new App();
app.start();