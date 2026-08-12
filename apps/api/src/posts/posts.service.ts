import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: string, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId,
      },
    });
  }

  async findAll(query: QueryPostsDto, userId?: string) {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { body: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { likes: true, comments: true } },
          ...(userId
            ? { likes: { where: { userId } } }
            : {}),
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts.map((post) => {
        const { likes, ...rest } = post as any;
        return {
          ...rest,
          isLikedByMe: userId ? likes?.length > 0 : false,
        };
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        ...(userId ? { likes: { where: { userId } } } : {}),
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const { likes, ...rest } = post as any;
    return {
      ...rest,
      isLikedByMe: userId ? likes?.length > 0 : false,
    };
  }

  async addComment(postId: string, authorId: string, createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        postId,
        authorId,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async toggleLike(postId: string, userId: string) {
    const existingLike = await this.prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.postLike.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });
      return { liked: false };
    } else {
      await this.prisma.postLike.create({
        data: { userId, postId },
      });
      return { liked: true };
    }
  }
}
