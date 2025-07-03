import { ConditionalOperator } from '../types';

export interface IConditions {
  field: string;
  operator: ConditionalOperator;
  value: any;
}
