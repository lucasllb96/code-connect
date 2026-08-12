import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  create(@Request() req: any, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user.sub, createPostDto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all posts (feed)' })
  findAll(@Request() req: any, @Query() query: QueryPostsDto) {
    // req.user will be populated if token is valid
    return this.postsService.findAll(query, req.user?.sub);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get post details' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.postsService.findOne(id, req.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  addComment(
    @Request() req: any,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.addComment(id, req.user.sub, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/likes')
  @ApiOperation({ summary: 'Toggle like on a post' })
  toggleLike(@Request() req: any, @Param('id') id: string) {
    return this.postsService.toggleLike(id, req.user.sub);
  }
}
