import { Sort } from '@/helpers/interfaces';

export interface IRequestParams {
  page: number;
  size: number;
  q: string;
  sort?: Sort[];

  [key: string]: any;
}
