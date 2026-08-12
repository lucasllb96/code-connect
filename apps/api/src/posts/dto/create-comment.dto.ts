import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Great post!', description: 'The content of the comment' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
