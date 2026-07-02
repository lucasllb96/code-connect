import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call AuthService.register with the DTO and return the result', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const expectedResult = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await authController.register(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with the DTO and return the token', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };
      const expectedResult = { access_token: 'jwt-token' };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await authController.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return the user object from the request', () => {
      const mockUser = { id: '123', name: 'John Doe', email: 'john@example.com' };
      const mockRequest = { user: mockUser };

      const result = authController.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });
});
