import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, RequestContextService],
})
export class UsersModule {}
