import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should register a new user and return user data without password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(undefined);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockUsersService.create.mockResolvedValue({
        id: '123',
        name: registerDto.name,
        email: registerDto.email,
        password: 'hashed-password',
      });

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should hash the password with bcrypt using 10 salt rounds', async () => {
      mockUsersService.findByEmail.mockResolvedValue(undefined);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockUsersService.create.mockResolvedValue({
        id: '123',
        name: registerDto.name,
        email: registerDto.email,
        password: 'hashed-password',
      });

      await authService.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should throw ConflictException if email is already in use', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: '456',
        name: 'Existing User',
        email: registerDto.email,
        password: 'some-hash',
      });

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should return an access_token with valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: '123',
        name: 'John Doe',
        email: loginDto.email,
        password: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await authService.login(loginDto);

      expect(result).toEqual({ access_token: 'jwt-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'john@example.com',
        sub: '123',
      });
    });

    it('should throw UnauthorizedException if email does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(undefined);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: '123',
        name: 'John Doe',
        email: loginDto.email,
        password: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
