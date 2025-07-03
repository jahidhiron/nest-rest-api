import { DbOperator } from './db-operator.type';

export type ConditionalOperator =
  | DbOperator.Equal
  | DbOperator.GreaterThan
  | DbOperator.LessThan
  | DbOperator.GreaterThanOrEqual
  | DbOperator.LessThanOrEqual
  | DbOperator.NotEqual
  | DbOperator.Like;
