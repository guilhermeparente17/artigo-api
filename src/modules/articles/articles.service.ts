import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContextService: RequestContextService,
  ) {}

  findAll() {
    return this.prisma.article.findMany({
      select: {
        id: true,
        tags: true,
        cover: true,
        title: true,
        content: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        //likes
        //comments
      },
    });
  }

  findAllByUser() {
    const userId = this.requestContextService.getUserId();
    return this.prisma.article.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        tags: true,
        cover: true,
        createdAt: true,
        updatedAt: true,

        //likes
        //comments
      },
    });
  }

  findOne(id: string) {
    return this.prisma.article.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        tags: true,
        cover: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        comments: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },

        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  }

  create(createArticleDto: CreateArticleDto) {
    const userId = this.requestContextService.getUserId();
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        userId: userId,
      },
    });
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    const userId = this.requestContextService.getUserId();
    return this.prisma.article.update({
      where: {
        id,
      },
      data: {
        ...updateArticleDto,
        userId: userId,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.article.delete({
      where: {
        id,
      },
    });
  }
}
