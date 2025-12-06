import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { getRepository } from 'typeorm';

import { Injectable as NestInjectable, Inject } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // accept x-api-key or Authorization: ApiKey <key>
    const headerKey = req.headers['x-api-key'] || (req.headers['authorization'] && req.headers['authorization'].startsWith('ApiKey ') ? req.headers['authorization'].split(' ')[1] : null);
    if (!headerKey) throw new ForbiddenException('API key missing');

    const rec = await this.authService.findKeyRecord(headerKey);
    if (!rec) throw new ForbiddenException('Invalid API key');
    if (!rec.active) throw new ForbiddenException('API key revoked');
    if (rec.expiresAt && new Date() > rec.expiresAt) throw new ForbiddenException('API key expired');

    // attach small identity for handlers
    req.apiKey = { id: rec.id, name: rec.name, ownerId: rec.owner?.id || null };
    return true;
  }
}
