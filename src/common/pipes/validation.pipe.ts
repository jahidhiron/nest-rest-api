import { ValidationPipe, BadRequestException } from '@nestjs/common';

function prettifyFieldName(field: string): string {
  if (!field || typeof field !== 'string') return '';

  const spaced = field
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function validationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (validationErrors = []) => {
      if (!Array.isArray(validationErrors)) {
        return new BadRequestException({
          statusCode: 400,
          status: 'BAD_REQUEST',
          message: 'Validation Error',
          errors: [],
        });
      }

      const formattedErrors = validationErrors.flatMap((error) => {
        if (
          !error ||
          typeof error !== 'object' ||
          !error.constraints ||
          typeof error.constraints !== 'object' ||
          !error.property
        ) {
          return [];
        }

        const prettyField = prettifyFieldName(error.property);
        const firstMessage = Object.values(error.constraints).find(
          (msg) => typeof msg === 'string',
        );

        if (!firstMessage) return [];

        const escapedProperty = error.property.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&',
        );
        const message = firstMessage.replace(
          new RegExp(escapedProperty, 'g'),
          prettyField,
        );

        return [
          {
            field: error.property,
            message,
          },
        ];
      });

      return new BadRequestException({
        statusCode: 400,
        status: 'BAD_REQUEST',
        message: 'Validation Error',
        errors: formattedErrors,
      });
    },
  });
}
