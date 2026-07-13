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
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

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

  async googleLogin(credential: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedException(
        'Não foi possível obter o email do Google',
      );
    }

    const { email, name, picture, sub: googleId } = payload;

    let user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: name ?? 'Usuário Google',
          password: null,
          googleId,
          avatar: picture,
          role: 'USER',
        },
      });
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token: accessToken,
      user,
    };
  }

  async login(data: LoginDto) {
    const user = await this.userService.findUserByEmail(data.email);

    if (
      user &&
      user.password &&
      (await bcrypt.compare(data.password, user.password))
    ) {
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

    const passwordMatches =
      user.password &&
      (await bcrypt.compare(data.currentPassword, user.password));

    if (!passwordMatches) {
      throw new UnauthorizedException('Senha atual incorreta.');
    }

    const samePassword =
      user.password && (await bcrypt.compare(data.newPassword, user.password));

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
