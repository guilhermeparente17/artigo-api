import { ApiProperty } from '@nestjs/swagger';

export class ArticleListDto {
  @ApiProperty({}) title: string;
  @ApiProperty({}) description: string;
  @ApiProperty({}) image: string;
  @ApiProperty({}) tags: string[];
  @ApiProperty({}) user: {
    name: string;
  };
  @ApiProperty({}) createdAt: string;
  @ApiProperty({}) likes: number;
  @ApiProperty({}) comments: number;
}

export class ArticleListByUserDto {
  @ApiProperty({}) title: string;
  @ApiProperty({}) tags: string[];
  @ApiProperty({}) createdAt: string;
  @ApiProperty({}) likes: number;
  @ApiProperty({}) comments: number;
}
