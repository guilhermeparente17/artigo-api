import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContextService: RequestContextService,
  ) {}

  async findAll(filters: ArticleFilterDto) {
    const { page = 1, limit = 10, search, tag, author } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            content: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),

      ...(tag && {
        tags: {
          has: tag,
        },
      }),

      ...(author && {
        user: {
          name: {
            contains: author,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      }),
    };

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },

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
              comments: true,
            },
          },

          likes: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      }),

      this.prisma.article.count({
        where,
      }),
    ]);

    return {
      data: articles,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllByUser(filters: ArticleFilterDto) {
    const userId = this.requestContextService.getUserId();

    const { page = 1, limit = 10, search, tag } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {
      userId,

      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            content: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),

      ...(tag && {
        tags: {
          has: tag,
        },
      }),
    };

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },

        select: {
          id: true,
          title: true,
          content: true,
          description: true,
          tags: true,
          cover: true,
          createdAt: true,
          updatedAt: true,

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

          likes: {
            select: {
              id: true,
              userId: true,
            },
          },

          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),

      this.prisma.article.count({
        where,
      }),
    ]);

    return {
      data: articles,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

        likes: {
          select: {
            id: true,
            userId: true,
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
