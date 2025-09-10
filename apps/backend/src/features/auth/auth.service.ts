import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USERS_REPOSITORY, UsersRepository } from '../../core/ports/users.repository';
import { hashPassword, verifyPassword } from '../../common/utils/password.util';
import { signToken } from '../../common/utils/token.util';
import { Inject } from '@nestjs/common';
import { UserEntity } from '../../core/domain/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
    private readonly jwt: JwtService,
  ) {}

  async signup(email: string, name: string, password: string): Promise<UserEntity> {
    const existing = await this.usersRepo.findByEmail(email);
    if (existing) throw new ConflictException('Email already exists');
    const passwordHash = await hashPassword(password);
    return this.usersRepo.create({ email, name, passwordHash });
  }

  async signin(email: string, password: string): Promise<{ user: UserEntity; token: string }> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await verifyPassword(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = signToken(this.jwt, { sub: user.id, email: user.email });
    return { user, token };
  }
}