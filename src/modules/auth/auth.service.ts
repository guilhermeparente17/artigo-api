import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './auth.dto';
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
      };
    }

    throw new UnauthorizedException();
  }
}
