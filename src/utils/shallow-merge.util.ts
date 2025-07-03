import { DeepPartial } from 'typeorm';
import { GenericObject } from './types';

export const shallowMerge = <T extends GenericObject>(
  source: T,
  destination: DeepPartial<T> | null,
): T => {
  if (
    typeof destination === 'object' &&
    destination !== null &&
    !Array.isArray(destination)
  ) {
    return {
      ...source,
      ...destination,
    };
  }

  return source;
};
