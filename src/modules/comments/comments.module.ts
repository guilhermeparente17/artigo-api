import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService, RequestContextService],
})
export class CommentsModule {}
