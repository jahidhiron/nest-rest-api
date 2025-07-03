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

export function UpdateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user information',
      description:
        'Allows an authenticated user (or admin) to update user details like name or avatar by user ID. Email cannot be updated.',
    }),
    ApiBody({
      // type: UpdateUserDto,
      schema: {
        example: {
          firstName: 'John',
          // lastName is omitted to show it’s optional
          avatar: 'https://example.com/avatar.jpg',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User updated successfully',
      schema: {
        example: {
          method: HttpMethod.PATCH,
          success: true,
          status: HTTP_STATUS.OK.context,
          statusCode: HTTP_STATUS.OK.status,
          path: '/api/v1/users/2',
          timestamp: '2025-07-02T12:07:11.098Z',
          message: 'User updated successful',
          data: {
            id: 2,
            firstName: 'Jhon',
            lastName: 'Doe',
            email: 'user1@gmail.com',
            role: 'author',
            verified: false,
            avatar: 'https://google.com/img',
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
                path: '/api/v1/users/2',
                message: 'Unauthorized',
                timestamp: '2025-07-02T11:31:35.041Z',
              },
            },
            permissionDenied: {
              summary: 'Permission Denied (Updating someone else’s data)',
              value: {
                success: false,
                method: HttpMethod.PATCH,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/users/2',
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
          path: '/api/v1/users/2',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
