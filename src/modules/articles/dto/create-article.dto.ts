import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Article title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Article description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Article content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Article tags',
    example: ['nestjs', 'typescript', 'backend'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'Article cover (url_image)',
  })
  @IsString()
  @IsNotEmpty()
  cover: string;
}
