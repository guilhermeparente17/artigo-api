import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContextService: RequestContextService,
  ) {}

  findAll() {
    return this.prisma.comment.findMany();
  }

  create(createCommentDto: CreateCommentDto) {
    const userId = this.requestContextService.getUserId();
    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        userId: userId,
      },
    });
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    const userId = this.requestContextService.getUserId();
    return this.prisma.comment.update({
      where: {
        id,
      },
      data: {
        ...updateCommentDto,
        userId: userId,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }
}
