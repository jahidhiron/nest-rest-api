import { Injectable } from '@nestjs/common';
import { AuthorRepository } from '../repositories';
import { IFindAll } from '@/common/repositories/types';
import { IRequestParams } from '@/common/interfaces';
import { RawQuery } from '@/helpers/interfaces';
import { AuthorEntity } from '../entities';

@Injectable()
export class FindAuthorsProvider {
  constructor(private authorRepository: AuthorRepository) {}

  async execute(
    params: IRequestParams,
  ): Promise<IFindAll<AuthorEntity, 'authors'>> {
    const rawQueries: RawQuery[] = [];
    const { page, size, sort, q, ...restQuery } = params;

    if (q) {
      rawQueries.push({
        query: `
          (
            LOWER(author.firstName || ' ' || author.lastName) LIKE LOWER(:q)
          )
        `,
        q: `%${q.toLowerCase()}%`,
      });
    }

    const { collection, ...rest } = await this.authorRepository.findAll({
      query: restQuery as Partial<AuthorEntity>,
      page,
      size,
      sort,
      rawQueries,
    });

    return { ...rest, authors: collection };
  }
}
