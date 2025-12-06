import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiKey } from "src/entities/service.key";
import { User } from "src/entities/user.entity";
import { AuthService } from "./auth.service";
import { JwtGuard } from "src/guards/auth.guards";
import { ApiKeyGuard } from "src/guards/api-key.guard";
import { AuthController } from "./auth.controller";


@Module({
  imports: [TypeOrmModule.forFeature([User, ApiKey])],
  providers: [AuthService, JwtGuard, ApiKeyGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtGuard, ApiKeyGuard],
})
export class AuthModule {}
