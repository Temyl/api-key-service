import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as ms from 'ms';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { ApiKey } from 'src/entities/service.key';
import { genApiKeyHex } from 'src/shared/utils/api-key';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(ApiKey) private keysRepo: Repository<ApiKey>,
  ) {}

  /** Sign up a new user */
  async signup(email: string, password: string, name: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({
      email: email,
      passwordHash: passwordHash, // store hashed password
      fullName: name,
    });

    return this.usersRepo.save(user);
  }

  /** Validate user credentials */
  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    return user;
  }

  /** Login and return JWT */
  async login(email: string, password: string) {
  const user = await this.validateUser(email, password);
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const payload = { sub: user.id, email: user.email };

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');
  const expires = process.env.JWT_EXPIRES_IN || '1h';

  // Use jwt.SignOptions explicitly
  const options: jwt.SignOptions = { expiresIn: expires as jwt.SignOptions['expiresIn'] };

  const token = jwt.sign(payload, secret as jwt.Secret, options);

  return {
    accessToken: token,
    user: { id: user.id, email: user.email, name: user.fullName },
  };
}

  /** Create an API key for service-to-service access */
  async createApiKey(ownerId: string | null, name: string, expiresAt?: string) {
    const rawKey = genApiKeyHex(
      parseInt(process.env.API_KEY_LENGTH_BYTES || '32', 10),
    );

    const hashKey = await bcrypt.hash(rawKey, 10);

    const record = this.keysRepo.create({
      key: hashKey, 
      name,
      active: true,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      owner: ownerId ? { id: ownerId } as any : null,
    });

    await this.keysRepo.save(record);

    // Return the raw key only once
    return { id: record.id, key: rawKey, name: record.name, expiresAt: record.expiresAt };
  }

  /** Revoke an API key */
  async revokeKey(id: string) {
    const key = await this.keysRepo.findOne({ where: { id } });
    if (!key) throw new BadRequestException('Key not found');

    key.active = false;
    await this.keysRepo.save(key);
    return true;
  }

  /** Find API key record */
  async findKeyRecord(rawKey: string) {
    // If hashed, compare here
    return this.keysRepo.findOne({ where: { key: rawKey } });
  }
}
