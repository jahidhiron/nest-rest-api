import { ObjectLiteral, Repository } from 'typeorm';
import { IConditions } from './condition.interface';
import { Sort } from './sorting.interface';
import { RawQuery } from './raw-query.interface';

export interface IQueryBuilder<T extends ObjectLiteral> {
  repo: Repository<T>;
  alias: string;
  query: Partial<T>;
  conditions?: IConditions[];
  page?: number;
  size?: number;
  relations?: string[];
  sort?: Sort[];
  rawQueries?: RawQuery[];
}
