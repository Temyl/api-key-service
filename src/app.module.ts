import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { ApiKey } from './entities/service.key';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes process.env variables available globally
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // or your database
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, ApiKey],
      synchronize: true, // ⚠️ disable in production
    }),
    TypeOrmModule.forFeature([User, ApiKey]), // inject repositories
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
