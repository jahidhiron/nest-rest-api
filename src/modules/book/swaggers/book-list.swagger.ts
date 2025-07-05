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

export function BookListDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get list of books',
      description:
        'Returns a paginated list of books. Supports search (`q`), page/size and JSON‑encoded sort rules.',
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
      description: 'Number of items per page',
      example: 10,
      type: Number,
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      description:
        'Sort rules (JSON). E.g. `[{"whom":"publishedDate","order":"desc"}]`',
      example: '[{"whom":"title", "order": "asc"}]',
      type: String,
    }),
    ApiQuery({
      name: 'q',
      required: false,
      description: 'Search term (matches title / ISBN / genre)',
      example: '',
      type: String,
    }),
    ApiQuery({
      name: 'authorId',
      required: false,
      description: 'Filter books by numeric author ID',
      example: 1,
      type: Number,
    }),

    ApiResponse({
      status: HttpStatus.OK,
      description: 'Get book list successful (with books)',
      schema: {
        example: {
          method: HttpMethod.GET,
          success: true,
          status: HTTP_STATUS.OK.context,
          statusCode: HTTP_STATUS.OK.status,
          path: '/api/v1/books',
          timestamp: '2025-07-02T19:19:11.059Z',
          message: 'Get book list successful',
          data: {
            books: [
              {
                id: 1,
                title: 'The Great Gatsby',
                isbn: '9780743273565',
                publishedDate: '1925-04-10',
                genre: 'Classic',
                authorId: 1,
              },
              {
                id: 2,
                title: '1984',
                isbn: '9780451524935',
                publishedDate: '1949-06-08',
                genre: 'Dystopian',
                authorId: 2,
              },
              {
                id: 3,
                title: 'To Kill a Mockingbird',
                isbn: '9780061120084',
                publishedDate: '1960-07-11',
                genre: 'Classic',
                authorId: 3,
              },
              {
                id: 4,
                title: 'Pride and Prejudice',
                isbn: '9780141439518',
                publishedDate: '1813-01-28',
                genre: 'Romance',
                authorId: 4,
              },
              {
                id: 5,
                title: 'The Hobbit',
                isbn: '9780547928227',
                publishedDate: '1937-09-21',
                genre: 'Fantasy',
                authorId: 5,
              },
              {
                id: 6,
                title: 'Moby‑Dick',
                isbn: '9781503280786',
                publishedDate: '1851-10-18',
                genre: 'Adventure',
                authorId: 6,
              },
            ],
            meta: {
              total: 6,
              pages: 1,
              currentPage: 1,
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
              summary: 'Unauthorized (missing or invalid token)',
              value: {
                success: false,
                method: HttpMethod.GET,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/books',
                message: 'Unauthorized',
                timestamp: '2025-07-02T11:31:35.041Z',
              },
            },
            permissionDenied: {
              summary: 'Permission denied',
              value: {
                success: false,
                method: HttpMethod.GET,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/books',
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
          method: HttpMethod.GET,
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
          path: '/api/v1/books',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
