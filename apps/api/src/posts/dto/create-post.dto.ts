import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My first post', description: 'The title of the post' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'This is the content of my post.', description: 'The body of the post' })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiProperty({ example: 'https://example.com/image.png', description: 'Optional thumbnail URL', required: false })
  @IsOptional()
  @IsUrl({ require_tld: false })
  thumbnailUrl?: string;
}
