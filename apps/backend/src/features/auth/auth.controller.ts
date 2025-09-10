import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { setAuthCookie, clearAuthCookie } from '../../common/utils/cookie.util';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { USERS_REPOSITORY, UsersRepository } from '../../core/ports/users.repository';
import { Inject } from '@nestjs/common';
import { RequestWithUser } from '../../common/types/request-with-user';
import { CsrfGuard } from '../../common/guards/csrf.guard';

const COOKIE_SECURE = String(process.env.COOKIE_SECURE ?? 'false') === 'true';
const CSRF_ENABLED = String(process.env.SECURITY_CSRF ?? 'true') === 'true';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
  ) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res() res: Response): Promise<void> {
    const u = await this.auth.signup(dto.email, dto.name, dto.password);
    res.status(201).json({ id: u.id, email: u.email, name: u.name });
  }

  @Post('signin')
  async signin(@Body() dto: SigninDto, @Res() res: Response): Promise<void> {
    const { user, token } = await this.auth.signin(dto.email, dto.password);
    const csrf = setAuthCookie(res, token, COOKIE_SECURE);
    res.json({ id: user.id, email: user.email, name: user.name, csrfToken: CSRF_ENABLED ? csrf : undefined });
  }

  @Post('signout')
  @UseGuards(...(CSRF_ENABLED ? [CsrfGuard] : []))
  async signout(@Res() res: Response): Promise<void> {
    clearAuthCookie(res, COOKIE_SECURE);
    res.status(204).send();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: RequestWithUser): Promise<{ id: string; email: string; name: string }> {
    const auth = req.auth!;
    const user = await this.usersRepo.findByEmail(auth.email);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user.id, email: user.email, name: user.name };
  }
}
