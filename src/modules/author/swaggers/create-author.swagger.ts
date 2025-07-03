import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';
import { CreateAuthorDto } from '../dtos';

export function CreateAuthorDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new author',
      description:
        'Allows an authenticated user to create a new author with first name, last name, optional bio, and birth date.',
    }),
    ApiBody({
      type: CreateAuthorDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Author created successfully',
      schema: {
        example: {
          method: HttpMethod.POST,
          success: true,
          status: HTTP_STATUS.CREATED.context,
          statusCode: HTTP_STATUS.CREATED.status,
          path: '/api/v1/authors',
          timestamp: '2025-07-02T12:07:11.098Z',
          message: 'Author created successfully',
          data: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            bio: 'Author bio here',
            birthDate: '1980-05-15',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.BAD_REQUEST.context,
          statusCode: HTTP_STATUS.BAD_REQUEST.status,
          path: '/api/v1/authors',
          message: 'Validation Error',
          timestamp: '2025-06-30T08:21:51.772Z',
          errors: [
            {
              field: 'firstName',
              message: 'First name must be a string',
            },
            {
              field: 'lastName',
              message: 'Last name must be a string',
            },
          ],
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
                method: HttpMethod.POST,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/authors',
                message: 'Unauthorized',
                timestamp: '2025-07-02T11:31:35.041Z',
              },
            },
            permissionDenied: {
              summary:
                'Permission Denied (Insufficient rights, need to be author role)',
              value: {
                success: false,
                method: HttpMethod.POST,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/authors',
                message: 'Permission denied',
                timestamp: '2025-07-02T16:18:56.099Z',
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
          method: HttpMethod.POST,
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
          path: '/api/v1/authors',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
