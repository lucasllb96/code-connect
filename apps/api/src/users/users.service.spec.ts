import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    };

    it('should create and return a new user', async () => {
      const expectedUser = {
        id: '123',
        ...createData,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await usersService.create(createData);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toEqual(expectedUser);
    });

    it('should throw ConflictException when email already exists (P2002)', async () => {
      // This is the specific bug fix: Prisma throws a unique-constraint error (P2002)
      // when a duplicate email is inserted, which previously caused an unhandled 500.
      // UsersService.create must catch this and throw ConflictException instead.
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`email`)',
        { code: 'P2002', clientVersion: '5.0.0', meta: { target: ['email'] } },
      );
      mockPrismaService.user.create.mockRejectedValue(prismaError);

      await expect(usersService.create(createData)).rejects.toThrow(
        ConflictException,
      );
      await expect(usersService.create(createData)).rejects.toThrow(
        'Email already in use',
      );
    });

    it('should re-throw unexpected errors from Prisma', async () => {
      const unexpectedError = new Error('Unexpected DB error');
      mockPrismaService.user.create.mockRejectedValue(unexpectedError);

      await expect(usersService.create(createData)).rejects.toThrow(
        'Unexpected DB error',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersService.findByEmail('john@example.com');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await usersService.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersService.findById('123');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await usersService.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });
});
