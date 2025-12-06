import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/user-signup.dto';
import { LoginDto } from './dto/user-login.dto';
import { JwtGuard } from 'src/guards/auth.guards';
import { CreateApiKeyDto } from './dto/api-key.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() body: SignupDto) {
    const user = await this.service.signup(body.email, body.password, body.name);
    return { id: user.id, email: user.email, name: user.fullName };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    return this.service.login(body.email, body.password);
  }

  // create API key (must be authenticated as user)
  @Post('keys')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createKey(@Body() body: CreateApiKeyDto, @Req() req: any) {
    const ownerId = req.user?.sub;
    const rec = await this.service.createApiKey(ownerId, body.name, body.expiresAt);
    
    return rec;
  }


  @Post('keys/:id/revoke')
  @UseGuards(JwtGuard)
  async revokeKey(@Req() req: any) {
    const id = req.params.id;
    await this.service.revokeKey(id);
    return { status: 'ok' };
  }

  // list keys - use owner ID
  @Get('keys')
  @UseGuards(JwtGuard)
  async listKeys(@Req() req: any) {
    const ownerId = req.user?.sub;
    // naive find
    return this.service['keysRepo'].find({ where: { owner: { id: ownerId } } });
  }
}
