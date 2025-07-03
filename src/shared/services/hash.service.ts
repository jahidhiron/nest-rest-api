import {
  HASH_ENCODING_FORMAT,
  HASH_KEY_LENGTH,
  HASH_SALT_BYTE_SIZE,
} from '@/shared/constants';
import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { IHashOptions } from './interfaces';

const scryptAsync = promisify(_scrypt);

@Injectable()
export class HashService {
  private readonly defaultByteSize: number = HASH_SALT_BYTE_SIZE;
  private readonly defaultFormat: BufferEncoding = HASH_ENCODING_FORMAT;
  private readonly defaultKeyLength: number = HASH_KEY_LENGTH;

  async hash(password: string, options: IHashOptions = {}): Promise<string> {
    const byteSize = options.byteSize ?? this.defaultByteSize;
    const format = options.format ?? this.defaultFormat;
    const keyLength = options.keyLength ?? this.defaultKeyLength;

    const salt = randomBytes(byteSize).toString(format);
    const buf = (await scryptAsync(password, salt, keyLength)) as Buffer;

    return `${buf.toString(format)}.${salt}`;
  }

  async verify(
    storedPassword: string,
    suppliedPassword: string,
    options: IHashOptions = {},
  ): Promise<boolean> {
    const format = options.format ?? this.defaultFormat;
    const keyLength = options.keyLength ?? this.defaultKeyLength;

    const [hashed, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(
      suppliedPassword,
      salt,
      keyLength,
    )) as Buffer;

    return buf.toString(format) === hashed;
  }
}
