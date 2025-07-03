/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppLogger } from '@/common';
import { ICatchError } from '@/common/interfaces';
import { ConfigService } from '@/config';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import IORedis, { Redis as RedisClient, RedisOptions } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: RedisClient;
  private readonly bullMqClient: RedisClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    const { host, port, password } = this.configService.redis;

    const redisOptions: RedisOptions = {
      host,
      port,
      password,
      connectTimeout: 10000,
      maxRetriesPerRequest: 5,
      lazyConnect: false,
      retryStrategy: (times: number): number | null => {
        const initialDelay = 100;
        const maxDelay = 3000;
        const jitter = Math.random() * 100 + 50;
        return Math.min(initialDelay * 2 ** times, maxDelay) * jitter;
      },
    };

    this.client = new IORedis(redisOptions) as RedisClient;
    this.bullMqClient = new IORedis({
      ...redisOptions,
      maxRetriesPerRequest: null,
    }) as RedisClient;

    this.attachEvents(this.client, 'default');
    this.attachEvents(this.bullMqClient, 'bullMq');
  }

  private attachEvents(client: RedisClient, label: string): void {
    client.on('connect', () =>
      this.logger.log(`Connected to Redis (${label})`),
    );

    client.on('error', (error: unknown) => {
      if (error instanceof Error) {
        this.logger.error(
          `Redis (${label}) error`,
          error.stack ?? error.message,
        );
      } else if (typeof error === 'string') {
        this.logger.error(`Redis (${label}) error: ${error}`);
      } else {
        this.logger.error(`Redis (${label}) unknown error`);
      }
    });

    client.on('close', () =>
      this.logger.warn(`Redis (${label}) connection closed`),
    );
  }

  // Core Get/Set/Del
  async set(key: string, value: unknown, ttl = 60): Promise<void> {
    const data = JSON.stringify(value);
    await this.client.set(key, data, 'EX', ttl);
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (error: unknown) {
      const err = error as ICatchError;
      this.logger.warn(
        `Failed to parse Redis data for key "${key}"`,
        err.message,
      );
      return null;
    }
  }

  async del(keys: string | string[]): Promise<void> {
    if (Array.isArray(keys)) {
      await this.client.del(...keys);
    } else {
      await this.client.del(keys);
    }
  }

  // Hash Methods
  async hmset(
    key: string,
    values: Record<string, string | number>,
  ): Promise<void> {
    await this.client.hmset(key, values);
  }

  async hgetall<T = Record<string, string>>(key: string): Promise<T | null> {
    const data = await this.client.hgetall(key);
    return Object.keys(data).length === 0 ? null : (data as T);
  }

  // Set Methods
  async sadd(key: string, ...members: string[]): Promise<void> {
    await this.client.sadd(key, ...members);
  }

  smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async srem(key: string, ...members: string[]): Promise<void> {
    await this.client.srem(key, ...members);
  }

  // Expiration / Existence
  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  // Accessors
  getClient(): RedisClient {
    return this.client;
  }

  getBullMqClient(): RedisClient {
    return this.bullMqClient;
  }

  // Shutdown Handling
  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
    await this.bullMqClient.quit();
    this.logger.log('Redis clients disconnected on shutdown');
  }
}
