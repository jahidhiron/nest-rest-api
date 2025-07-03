import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import * as qs from 'qs';
import { JSONValue } from './types';
import { JSONObject } from './interfaces';

@Injectable()
export class DeserializeQuery implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (
      metadata.type !== 'query' ||
      typeof value !== 'object' ||
      value === null
    ) {
      return value;
    }

    const normalized = qs.parse(qs.stringify(value)) as Record<string, unknown>;

    const deepConvert = (val: unknown): JSONValue => {
      if (Array.isArray(val)) {
        return val.map(deepConvert);
      }

      if (val !== null && typeof val === 'object') {
        const converted: JSONObject = {};
        for (const key of Object.keys(val)) {
          converted[key] = deepConvert((val as Record<string, unknown>)[key]);
        }
        return converted;
      }

      if (typeof val === 'string') {
        const trimmed = val.trim();

        if (trimmed === 'true') return true;
        if (trimmed === 'false') return false;
        if (!isNaN(Number(trimmed)) && trimmed !== '') return Number(trimmed);

        if (
          (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
          (trimmed.startsWith('[') && trimmed.endsWith(']'))
        ) {
          try {
            const parsed: unknown = JSON.parse(trimmed);
            if (typeof parsed === 'object' || Array.isArray(parsed)) {
              return deepConvert(parsed);
            }
          } catch {
            return trimmed;
          }
        }

        return trimmed;
      }

      return val as JSONValue;
    };

    const result: Record<string, unknown> = {};
    for (const key of Object.keys(normalized)) {
      result[key] = deepConvert(normalized[key]);
    }

    return result;
  }
}
