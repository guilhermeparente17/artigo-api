import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard.guard';
import { RolesGuard } from 'src/common/guards/role-guard.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller({
  version: '1',
  path: 'likes',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Roles('USER')
  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @Roles('USER')
  @Delete(':id/article/:articleId')
  remove(@Param('id') id: string, @Param('articleId') articleId: string) {
    return this.likesService.remove(id, articleId);
  }
}
