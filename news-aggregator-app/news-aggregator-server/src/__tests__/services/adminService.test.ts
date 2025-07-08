import adminService from '../../services/adminService';
import adminRepository from '../../repositories/adminRepository';
import { BadRequestError } from '../../utils/error';


jest.mock('../../repositories/adminRepository');

const mockedAdminRepository = adminRepository as jest.Mocked<typeof adminRepository>;

describe('AdminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addCategory', () => {
    it('should successfully add a new category in Title Case', async () => {
      const newCategoryName = 'technology';
      mockedAdminRepository.findCategoryByName.mockResolvedValue(null);
      mockedAdminRepository.createCategory.mockResolvedValue({ name: 'Technology' } as any);

      await adminService.addCategory(newCategoryName);

      expect(mockedAdminRepository.createCategory).toHaveBeenCalledWith('Technology');
    });

    it('should throw a BadRequestError if the category already exists', async () => {
      const existingCategoryName = 'Technology';
  
      mockedAdminRepository.findCategoryByName.mockResolvedValue({ name: 'Technology' } as any);

      await expect(adminService.addCategory(existingCategoryName)).rejects.toThrow(BadRequestError);
    });
  });

});