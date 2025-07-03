// import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
// import { IQueryBuilder } from './interfaces/query-builder.interface';

// function createParam<T>(key: string, value: T): Record<string, T> {
//   return { [key]: value };
// }

// export function createQueryBuilder<T extends ObjectLiteral>(
//   queryBuilder: IQueryBuilder<T>,
// ): SelectQueryBuilder<T> {
//   const qb = queryBuilder.repo.createQueryBuilder(queryBuilder.alias);

//   // Add relations
//   queryBuilder.relations?.forEach((relation) => {
//     qb.leftJoinAndSelect(`${queryBuilder.alias}.${relation}`, relation);
//   });

//   // Add filters for params
//   Object.keys(queryBuilder.query).forEach((key) => {
//     const typedKey = key as keyof T;
//     const value = queryBuilder.query[typedKey];
//     if (value !== undefined && value !== null) {
//       qb.andWhere(
//         `${queryBuilder.alias}.${key} = :${key}`,
//         createParam(key, value),
//       );
//     }
//   });

//   // Add additional conditions
//   queryBuilder.conditions?.forEach(({ field, operator, value }, index) => {
//     const paramKey = `customCond${index}`;
//     qb.andWhere(
//       `${queryBuilder.alias}.${field} ${operator} :${paramKey}`,
//       createParam(paramKey, value),
//     );
//   });

//   // Apply sorting
//   queryBuilder.sort?.forEach(({ whom, order }) => {
//     const column = whom.includes('.') ? whom : `${queryBuilder.alias}.${whom}`;
//     if (!qb.expressionMap.orderBys[column]) {
//       qb.orderBy(column, order.toUpperCase() as 'ASC' | 'DESC');
//     } else {
//       qb.addOrderBy(column, order.toUpperCase() as 'ASC' | 'DESC');
//     }
//   });

//   if (queryBuilder.sort && queryBuilder.sort.length) {
//     queryBuilder.sort?.forEach(({ whom, order }) => {
//       const column = whom.includes('.')
//         ? whom
//         : `${queryBuilder.alias}.${whom}`;
//       if (!qb.expressionMap.orderBys[column]) {
//         qb.orderBy(column, order.toUpperCase() as 'ASC' | 'DESC');
//       } else {
//         qb.addOrderBy(column, order.toUpperCase() as 'ASC' | 'DESC');
//       }
//     });
//   }

//   // Apply pagination
//   if (queryBuilder.page !== undefined && queryBuilder.size !== undefined) {
//     const skip = (queryBuilder.page - 1) * queryBuilder.size;
//     qb.skip(skip).take(queryBuilder.size);
//   }

//   return qb;
// }

import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { IQueryBuilder } from './interfaces/query-builder.interface';

function createParam<T>(key: string, value: T): Record<string, T> {
  return { [key]: value };
}

export function createQueryBuilder<T extends ObjectLiteral>(
  queryBuilder: IQueryBuilder<T>,
): SelectQueryBuilder<T> {
  const qb = queryBuilder.repo.createQueryBuilder(queryBuilder.alias);

  // Add relations
  queryBuilder.relations?.forEach((relation) => {
    qb.leftJoinAndSelect(`${queryBuilder.alias}.${relation}`, relation);
  });

  // Add filters for query params
  Object.keys(queryBuilder.query).forEach((key) => {
    const typedKey = key as keyof T;
    const value = queryBuilder.query[typedKey];
    if (value !== undefined && value !== null) {
      qb.andWhere(
        `${queryBuilder.alias}.${key} = :${key}`,
        createParam(key, value),
      );
    }
  });

  // Add additional conditions
  queryBuilder.conditions?.forEach(({ field, operator, value }, index) => {
    const paramKey = `customCond${index}`;
    qb.andWhere(
      `${queryBuilder.alias}.${field} ${operator} :${paramKey}`,
      createParam(paramKey, value),
    );
  });

  if (queryBuilder.rawQueries) {
    for (const item of queryBuilder.rawQueries) {
      const values = Object.keys(item);

      if (values.length > 1) {
        qb.andWhere(item.query, { [values[1]]: item[values[1]] });
      }
    }
  }

  // Apply sorting
  queryBuilder.sort?.forEach(({ whom, order }) => {
    const column = whom.includes('.') ? whom : `${queryBuilder.alias}.${whom}`;
    if (!qb.expressionMap.orderBys[column]) {
      qb.orderBy(column, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.addOrderBy(column, order.toUpperCase() as 'ASC' | 'DESC');
    }
  });

  // Apply pagination
  if (queryBuilder.page !== undefined && queryBuilder.size !== undefined) {
    const skip = (queryBuilder.page - 1) * queryBuilder.size;
    qb.skip(skip).take(queryBuilder.size);
  }

  return qb;
}
