import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from '../../core/ports/users.repository';
import { UserEntity } from '../../core/domain/user.entity';
import { UserDocument, UserModel } from '../db/schemas/user.schema';

@Injectable()
export class MongoUsersRepository implements UsersRepository {
  constructor(@InjectModel(UserModel.name) private readonly model: Model<UserDocument>) {}

  async create(params: { email: string; name: string; passwordHash: string }): Promise<UserEntity> {
    const doc = new this.model(params);
    const saved = await doc.save();
    return this.map(saved);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this.model.findOne({ email }).exec();
    return doc ? this.map(doc) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.map(doc) : null;
  }

  private map(doc: UserDocument): UserEntity {
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
