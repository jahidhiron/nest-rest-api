import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository, DataSource, ObjectLiteral, DeepPartial } from 'typeorm';
import { createQueryBuilder } from '@/helpers';
import { FindOptions } from './interfaces/find-options.interface';
import { IFindAll } from './types';

@Injectable()
export class BaseRepository<T extends ObjectLiteral> {
  protected readonly repo: Repository<T>;

  constructor(
    protected readonly dataSource: DataSource,
    entity: new () => T,
    private readonly alias: string,
  ) {
    this.repo = this.dataSource.getRepository(entity);
  }

  async findAll(options: FindOptions<T>): Promise<IFindAll<T>> {
    if (options.sort && !Array.isArray(options.sort)) {
      throw new BadRequestException(
        'Sort must be an array, Each sort item must have "whom" as string and "order" as "asc" or "desc"',
      );
    }

    if (options.sort) {
      for (const s of options.sort) {
        if (
          typeof s.whom !== 'string' ||
          !['asc', 'desc'].includes(s.order.toLowerCase())
        ) {
          throw new BadRequestException(
            'Each sort item must have "whom" as string and "order" as "asc" or "desc"',
          );
        }
      }
    }

    const qb = createQueryBuilder<T>({
      repo: this.repo,
      alias: this.alias,
      query: options.query ?? {},
      conditions: options.conditions,
      page: options.page,
      size: options.size,
      relations: options.relations,
      sort: options.sort ?? [],
      rawQueries: options.rawQueries ?? [],
    });

    const [collection, total] = await qb.getManyAndCount();

    const page = options.page ?? 1;
    const size = options.size ?? total;
    const pages = Math.ceil(total / size);

    return {
      collection,
      meta: {
        total,
        pages,
        currentPage: page,
      },
    };
  }

  async findOne(options: FindOptions<T>): Promise<T | null> {
    const qb = createQueryBuilder<T>({
      repo: this.repo,
      alias: this.alias,
      query: options.query ?? {},
      conditions: options.conditions,
      relations: options.relations,
      sort: options.sort,
    });

    return qb.getOne();
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async update(query: Partial<T>, data: DeepPartial<T>): Promise<T | null> {
    const entity = await this.repo.findOne({ where: query });
    if (!entity) return null;

    const merged = this.repo.merge(entity, data);
    return this.repo.save(merged);
  }

  async remove(query: Partial<T>): Promise<T | null> {
    const entity = await this.repo.findOne({ where: query });
    if (!entity) {
      return null;
    }

    await this.repo.delete(query);
    return entity;
  }
}
