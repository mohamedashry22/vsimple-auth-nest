import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from '../../core/ports/users.repository';
import { UserEntity } from '../../core/domain/user.entity';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository) {}

  getByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepo.findByEmail(email);
  }
}