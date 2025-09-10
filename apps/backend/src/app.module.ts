import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { buildConfig } from './config/app.config';
import { MongooseInfraModule } from './infrastructure/db/mongoose.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { MetricsModule } from './common/metrics/metrics.module';
import { SharedAuthModule } from './common/auth/shared-auth.module';

const cfg = buildConfig(process.env);

@Module({
  imports: [
    MongooseModule.forRoot(cfg.mongoUri),
    MongooseInfraModule,
    MetricsModule,
    SharedAuthModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}