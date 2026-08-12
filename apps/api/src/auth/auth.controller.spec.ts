import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

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

describe('RegisterDto validation', () => {
  it('should reject a body that contains rememberMe', async () => {
    const body = plainToInstance(RegisterDto, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      rememberMe: true,
    });

    const errors = await validate(body, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
    expect(messages.some((m) => m.includes('rememberMe'))).toBe(true);
  });

  it('should accept a valid register body without rememberMe', async () => {
    const body = plainToInstance(RegisterDto, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const errors = await validate(body, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors.length).toBe(0);
  });
});

describe('LoginDto validation', () => {
  it('should reject a body that contains rememberMe', async () => {
    const body = plainToInstance(LoginDto, {
      email: 'john@example.com',
      password: 'password123',
      rememberMe: true,
    });

    const errors = await validate(body, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
    expect(messages.some((m) => m.includes('rememberMe'))).toBe(true);
  });

  it('should accept a valid login body without rememberMe', async () => {
    const body = plainToInstance(LoginDto, {
      email: 'john@example.com',
      password: 'password123',
    });

    const errors = await validate(body, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors.length).toBe(0);
  });
});
