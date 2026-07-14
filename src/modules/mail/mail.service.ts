import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Resend } from 'resend';
import * as fs from 'fs/promises';
import * as path from 'path';
import Handlebars from 'handlebars';

@Injectable()
export class MailService {
  private readonly resend: Resend;

  private async renderTemplate(
    template: string,
    context: Record<string, unknown>,
  ): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'mail',
      'templates',
      `${template}.hbs`,
    );

    const source = await fs.readFile(templatePath, 'utf-8');

    const compiled = Handlebars.compile(source);

    return compiled(context);
  }

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendWelcomeEmail(user: User) {
    const html = await this.renderTemplate('welcome', {
      name: user.name,
      loginUrl: 'https://artigo-front.vercel.app/login',
    });

    const { data, error } = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'gp3030814@gmail.com',
      subject: 'Bem-vindo ao Artigo 🚀',
      html,
    });

    console.log(data, error);
  }
}
