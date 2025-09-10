import { UserEntity } from '../domain/user.entity';

export interface UsersRepository {
  create(params: { email: string; name: string; passwordHash: string }): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');