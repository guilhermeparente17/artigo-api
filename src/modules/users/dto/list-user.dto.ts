import { ApiProperty } from '@nestjs/swagger';

export class UserListDto {
  @ApiProperty({}) name: string;
  @ApiProperty({}) email: string;
  @ApiProperty({}) createdAt: string;
  @ApiProperty({}) updatedAt: string;
}
