import userService from '../../services/userService';
import notificationService from '../../services/notificationService';
import savedArticleRepository from '../../repositories/savedArticleRepository';
import articleRepository from '../../repositories/articleRepository';
import notificationRepository from '../../repositories/notificationRepository';
import { BadRequestError } from '../../utils/error';

jest.mock('../../repositories/savedArticleRepository');
jest.mock('../../repositories/articleRepository');
jest.mock('../../repositories/notificationRepository');

const mockedSavedArticleRepo = savedArticleRepository as jest.Mocked<typeof savedArticleRepository>;
const mockedArticleRepo = articleRepository as jest.Mocked<typeof articleRepository>;
const mockedNotificationRepo = notificationRepository as jest.Mocked<typeof notificationRepository>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveArticle', () => {
    it('should successfully save an article that is not already saved', async () => {

      mockedArticleRepo.findById.mockResolvedValue({ _id: 'article1' } as any);
      mockedSavedArticleRepo.findOne.mockResolvedValue(null); 
      mockedSavedArticleRepo.create.mockResolvedValue({} as any);

      await userService.saveArticle('user1', 'article1');
      
      expect(mockedSavedArticleRepo.create).toHaveBeenCalledWith('user1', 'article1');
    });

    it('should throw a BadRequestError if the article is already saved', async () => {
      mockedArticleRepo.findById.mockResolvedValue({ _id: 'article1' } as any);
      mockedSavedArticleRepo.findOne.mockResolvedValue({} as any); 

      await expect(userService.saveArticle('user1', 'article1')).rejects.toThrow(BadRequestError);
    });
  });
});


describe('NotificationService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getSettings', () => {
      it('should find or create settings for a user', async () => {
        mockedNotificationRepo.findOrCreateSettingsForUser.mockResolvedValue({ enabledCategories: [], keywords: [] } as any);
        
        const settings = await notificationService.getSettings('user1');
  
        expect(mockedNotificationRepo.findOrCreateSettingsForUser).toHaveBeenCalledWith('user1');
        expect(settings).toBeDefined();
      });
    });

    describe('updateSettings', () => {
        it('should call the repository to update user settings', async () => {
          
          const newSettings = { enabledCategories: ['Business'] };
          mockedNotificationRepo.updateSettingsForUser.mockResolvedValue(newSettings as any);

          await notificationService.updateSettings('user1', newSettings);

          expect(mockedNotificationRepo.updateSettingsForUser).toHaveBeenCalledWith('user1', newSettings);
        });
    });
});