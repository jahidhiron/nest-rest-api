import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  /**
   * Generate a secure random token string
   * @param length length of token string in bytes (default 32 bytes = 64 hex chars)
   */
  generateToken(length = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
