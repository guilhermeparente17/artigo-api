import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    // criar uma hash
    const hash = await bcrypt.hash(data.password, 12);

    // criar um novo usuario
    const newUser = await this.userService.create({
      ...data,
      password: hash,
    });

    // devolver um token
    return {
      token: this.jwtService.sign({
        sub: newUser.id,
      }),
    };
  }

  async login(data: LoginDto) {
    const user = await this.userService.findUserByEmail(data.email);

    if (user && (await bcrypt.compare(data.password, user.password))) {
      return {
        token: this.jwtService.sign({
          sub: user.id,
        }),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    }

    throw new UnauthorizedException();
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userService.findUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const passwordMatches = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Senha atual incorreta.');
    }

    const samePassword = await bcrypt.compare(data.newPassword, user.password);

    if (samePassword) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da atual.',
      );
    }

    const hash = await bcrypt.hash(data.newPassword, 12);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hash,
      },
    });

    return {
      message: 'Senha atualizada com sucesso!',
    };
  }
}
