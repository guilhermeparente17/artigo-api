import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    description: 'Article Id',
  })
  @IsString()
  @IsNotEmpty()
  articleId: string;
}
