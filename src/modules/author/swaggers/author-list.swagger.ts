import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function AuthorListDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get list of authors',
      description:
        'Returns a paginated list of authors. Supports page / size, sorting, and text search.',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (1‑based)',
      example: 1,
      type: Number,
    }),
    ApiQuery({
      name: 'size',
      required: false,
      description: 'Page size',
      example: 10,
      type: Number,
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      description:
        'Sort rules as JSON string. E.g. `[{"whom":"id","order":"asc"}]`',
      example: '[{"whom":"id","order":"asc"}]',
      type: String,
    }),
    ApiQuery({
      name: 'q',
      required: false,
      description: 'Free‑text search query',
      example: 'Austen',
      type: String,
    }),

    ApiResponse({
      status: HttpStatus.OK,
      description: 'Get author list successful',
      content: {
        'application/json': {
          examples: {
            withAuthors: {
              summary: 'Authors found',
              value: {
                method: HttpMethod.GET,
                success: true,
                status: HTTP_STATUS.OK.context,
                statusCode: HTTP_STATUS.OK.status,
                path: '/api/v1/authors',
                timestamp: '2025-07-02T12:23:46.378Z',
                message: 'Get author list successful',
                data: {
                  authors: [
                    {
                      id: 1,
                      firstName: 'Jane',
                      lastName: 'Austen',
                      bio: 'British novelist known for "Pride and Prejudice".',
                      birthDate: '1775-12-16',
                    },
                    {
                      id: 2,
                      firstName: 'Mark',
                      lastName: 'Twain',
                      bio: 'American writer, famous for "Adventures of Huckleberry Finn".',
                      birthDate: '1835-11-30',
                    },
                    {
                      id: 3,
                      firstName: 'Haruki',
                      lastName: 'Murakami',
                      bio: 'Japanese novelist and translator.',
                      birthDate: '1949-01-12',
                    },
                    {
                      id: 4,
                      firstName: 'Chimamanda',
                      lastName: 'Adichie',
                      bio: 'Nigerian writer of novels and short stories.',
                      birthDate: '1977-09-15',
                    },
                  ],
                  meta: {
                    total: 4,
                    pages: 1,
                    currentPage: 1,
                  },
                },
              },
            },
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
              summary: 'Unauthorized (no token or invalid)',
              value: {
                success: false,
                method: HttpMethod.GET,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/authors',
                message: 'Unauthorized',
                timestamp: '2025-07-02T11:31:35.041Z',
              },
            },
            permissionDenied: {
              summary: 'Permission denied (insufficient role)',
              value: {
                success: false,
                method: HttpMethod.GET,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/authors',
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
      content: {
        'application/json': {
          example: {
            success: false,
            method: HttpMethod.GET,
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
            path: '/api/v1/authors',
            message: 'Internal Server Error',
            timestamp: '2025-06-30T08:22:31.685Z',
          },
        },
      },
    }),
  );
}
