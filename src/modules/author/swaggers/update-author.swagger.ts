import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function UpdateAuthorDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update author information',
      description:
        'Allows an authenticated author or admin to update author details such as name, bio, or birth date by author ID.',
    }),
    ApiBody({
      schema: {
        example: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Test Bio',
          birthDate: '1990-07-02',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Author updated successfully',
      schema: {
        example: {
          method: HttpMethod.PATCH,
          success: true,
          status: HTTP_STATUS.OK.context,
          statusCode: HTTP_STATUS.OK.status,
          path: '/api/v1/authors/1',
          timestamp: '2025-07-02T18:15:22.354Z',
          message: 'Author updated successful',
          data: {
            id: 1,
            firstName: 'David',
            lastName: 'Hassuy',
            bio: 'Test Bio updated',
            birthDate: '1990-07-02T00:00:00.000Z',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      content: {
        'application/json': {
          examples: {
            unauthorized: {
              summary: 'Unauthorized (No token or invalid)',
              value: {
                success: false,
                method: HttpMethod.PATCH,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/authors/1',
                message: 'Unauthorized',
                timestamp: '2025-07-02T11:31:35.041Z',
              },
            },
            permissionDenied: {
              summary: 'Permission Denied (Trying to update another author)',
              value: {
                success: false,
                method: HttpMethod.PATCH,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/authors/1',
                message: 'Permission denied',
                timestamp: '2025-07-02T12:00:54.662Z',
              },
            },
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.PATCH,
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
          path: '/api/v1/authors/1',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
