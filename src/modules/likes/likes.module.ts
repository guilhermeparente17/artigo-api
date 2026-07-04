import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService, RequestContextService],
})
export class LikesModule {}
