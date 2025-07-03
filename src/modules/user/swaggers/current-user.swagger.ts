import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function CurrentUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get current user',
      description:
        'Returns the currently authenticated user’s information based on the provided access token.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Get current user successful',
      content: {
        'application/json': {
          examples: {
            withAuthor: {
              summary: 'User with author profile',
              value: {
                method: HttpMethod.GET,
                success: true,
                status: HTTP_STATUS.OK.context,
                statusCode: HTTP_STATUS.OK.status,
                path: '/api/v1/users/current-user',
                timestamp: '2025-07-02T11:46:37.721Z',
                message: 'Get current user successful',
                data: {
                  id: 2,
                  firstName: 'Jahid',
                  lastName: 'Hiron',
                  email: 'user1@gmail.com',
                  role: 'author',
                  verified: false,
                  avatar: null,
                  author: {
                    id: 1,
                    firstName: 'Jahid',
                    lastName: 'Hiron',
                    bio: null,
                    birthDate: null,
                  },
                },
              },
            },
            withoutAuthor: {
              summary: 'User without author profile',
              value: {
                method: HttpMethod.GET,
                success: true,
                status: HTTP_STATUS.OK.context,
                statusCode: HTTP_STATUS.OK.status,
                path: '/api/v1/users/current-user',
                timestamp: '2025-07-02T11:46:37.721Z',
                message: 'Get current user successful',
                data: {
                  id: 2,
                  firstName: 'Jahid',
                  lastName: 'Hiron',
                  email: 'user1@gmail.com',
                  role: 'user',
                  verified: false,
                  avatar: null,
                  author: null,
                },
              },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          success: false,
          method: HttpMethod.GET,
          status: HTTP_STATUS.UNAUTHORIZED.context,
          statusCode: HTTP_STATUS.UNAUTHORIZED.status,
          path: '/api/v1/users/current-user',
          message: 'Unauthorized',
          timestamp: '2025-07-02T11:31:35.041Z',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.GET,
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
          path: '/api/v1/users/current-user',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
