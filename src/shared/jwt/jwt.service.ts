import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { IGenerateTokenOptions, IVerifyTokenOptions } from './interfaces';
import { ConfigService } from '@/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: NestJwtService,
  ) {}

  async generateToken<T extends object = any>(
    payload: T,
    options?: IGenerateTokenOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  async verifyToken<T extends object = any>(
    token: string,
    options?: IVerifyTokenOptions,
  ): Promise<T> {
    return this.jwtService.verifyAsync(token, options);
  }

  async generateAccessToken<T extends object = any>(
    payload: T,
  ): Promise<string> {
    return this.generateToken(payload, {
      secret: this.configService.jwt.secretAccessToken,
      expiresIn: this.configService.jwt.accessTokenExpiredIn,
      issuer: this.configService.jwt.issuer,
      audience: this.configService.jwt.audience,
    });
  }

  async generateRefreshToken<T extends object = any>(
    payload: T,
  ): Promise<string> {
    return this.generateToken(payload, {
      secret: this.configService.jwt.secretRefreshToken,
      expiresIn: this.configService.jwt.refreshTokenExpiredIn,
      issuer: this.configService.jwt.issuer,
      audience: this.configService.jwt.audience,
    });
  }

  async verifyAccessToken<T extends object = any>(token: string): Promise<T> {
    return this.verifyToken(token, {
      secret: process.env.JWT_SECRET_ACCESS_TOKEN,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });
  }

  async verifyRefreshToken<T extends object = any>(token: string): Promise<T> {
    return this.verifyToken(token, {
      secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });
  }
}
