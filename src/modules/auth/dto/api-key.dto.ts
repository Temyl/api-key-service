import { IsString, IsOptional } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  name: string;

  @IsOptional()
  expiresAt?: string; // ISO date string optional
}
