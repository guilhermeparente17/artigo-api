import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersFiltersDto } from './dto/users-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: UsersFiltersDto) {
    const { page = 1, limit = 10, search, email, role } = filters;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          ...(search && {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }),

          ...(email && {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          }),

          ...(role && {
            role,
          }),
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              articles: true,
            },
          },
        },
      }),

      this.prisma.user.count({
        where: {
          ...(search && {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }),

          ...(email && {
            email: {
              contains: email,
              mode: 'insensitive',
            },
          }),

          ...(role && {
            role,
          }),
        },
      }),
    ]);

    return {
      data: users,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException();
    }

    return user;
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.article.deleteMany({
      where: {
        userId: id,
      },
    });
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async summary() {
    const [users, likes, comments, articles] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.like.count(),
      this.prisma.comment.count(),
      this.prisma.article.count(),
    ]);

    return {
      users,
      likes,
      comments,
      articles,
    };
  }
}
