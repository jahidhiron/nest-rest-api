import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories';
import { IFindAll } from '@/common/repositories/types';
import { IRequestParams } from '@/common/interfaces';
import { RawQuery } from '@/helpers/interfaces';
import { UserPayload } from '@/common/decorators/interfaces';

@Injectable()
export class FindUsersProvider {
  constructor(private userRepository: UserRepository) {}

  async execute(
    params: IRequestParams,
    userPayload: UserPayload,
  ): Promise<IFindAll<UserEntity, 'users'>> {
    const rawQueries: RawQuery[] = [];
    const { page, size, sort, q, ...restQuery } = params;

    if (q) {
      rawQueries.push({
        query: `
          (
            (LOWER(email) LIKE LOWER(:q)
            OR LOWER(usr.firstName || ' ' || usr.lastName) LIKE LOWER(:q))
          )
        `,
        q: `%${q.toLowerCase()}%`,
      });
    }

    rawQueries.push({
      query: `usr.id != :currentUserId`,
      currentUserId: userPayload.id,
    });

    const { collection, ...rest } = await this.userRepository.findAll({
      query: restQuery as Partial<UserEntity>,
      page,
      size,
      sort,
      rawQueries,
    });

    return { ...rest, users: collection };
  }
}
