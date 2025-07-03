import {
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function UpdateBookDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update book information',
      description: `Allows an authenticated user (or admin) to update book details—such as title, ISBN, published date, genre, or author—by book ID.

**Note:** The \`genre\` field must be one of the following values:
- Fantasy
- Science Fiction
- Thriller
- Mystery
- Romance
- Historical Fiction
- Horror
- Adventure
- Young Adult
- Non-Fiction
- Biography
- Self-Help
- Poetry
- Drama
- Classic
- Dystopian
- Graphic Novel
- Crime
- Memoir
- Humor`,
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
      description: 'Book updated successfully',
      schema: {
        example: {
          method: HttpMethod.PATCH,
          success: true,
          status: HTTP_STATUS.OK.context,
          statusCode: HTTP_STATUS.OK.status,
          path: '/api/v1/books/1',
          timestamp: '2025-07-02T19:03:50.882Z',
          message: 'Book updated successful',
          data: {
            id: 1,
            title: 'All you need to know Nestjs',
            isbn: 'IBNSS-25000',
            publishedDate: '2013-01-02',
            genre: 'Classic',
            authorId: 1,
            author: {
              id: 1,
              firstName: 'David',
              lastName: 'Hassuy',
              bio: 'Test Bio updated',
              birthDate: '1990-07-02',
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
              summary: 'Unauthorized (No token or invalid)',
              value: {
                success: false,
                method: HttpMethod.PATCH,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/books/1',
                message: 'Unauthorized',
                timestamp: '2025-07-02T19:04:00.000Z',
              },
            },
            permissionDenied: {
              summary: 'Permission Denied (Updating a book you do not own)',
              value: {
                success: false,
                method: HttpMethod.PATCH,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/books/1',
                message: 'Permission denied',
                timestamp: '2025-07-02T19:04:10.000Z',
              },
            },
          },
        },
      },
    }),

    ApiConflictResponse({
      description: 'ISBN already exists',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.CONFLICT.context,
          statusCode: HTTP_STATUS.CONFLICT.status,
          path: '/api/v1/books',
          message: 'ISBN already exist',
          timestamp: '2025-07-02T19:01:07.224Z',
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
          path: '/api/v1/books/1',
          message: 'Internal Server Error',
          timestamp: '2025-07-02T19:04:20.000Z',
        },
      },
    }),
  );
}
