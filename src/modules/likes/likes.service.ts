import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContextService: RequestContextService,
  ) {}

  create(createLikeDto: CreateLikeDto) {
    const userId = this.requestContextService.getUserId();
    return this.prisma.like.create({
      data: {
        ...createLikeDto,
        userId: userId,
      },
    });
  }

  remove(id: string, articleId: string) {
    const userId = this.requestContextService.getUserId();
    return this.prisma.like.delete({
      where: {
        id,
        articleId,
        userId,
      },
    });
  }
}
