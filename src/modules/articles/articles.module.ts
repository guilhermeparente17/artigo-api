import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService, RequestContextService],
})
export class ArticlesModule {}
