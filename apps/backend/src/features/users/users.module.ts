import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '../../infrastructure/db/schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { USERS_REPOSITORY } from '../../core/ports/users.repository';
import { MongoUsersRepository } from '../../infrastructure/repositories/mongo-users.repository';
import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../common/auth/shared-auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    SharedAuthModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USERS_REPOSITORY, useClass: MongoUsersRepository },
  ],
  exports: [
    UsersService,
    { provide: USERS_REPOSITORY, useClass: MongoUsersRepository },
  ],
})
export class UsersModule {}