import {
  ApiBadRequestResponse,
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
import { CreateBookDto } from '../dtos';

export function CreateBookDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new book',
      description: `Allows an authenticated user to create a book with title, ISBN, optional published date and genre, and author ID.

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
    ApiBody({ type: CreateBookDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Book created successfully',
      schema: {
        example: {
          method: HttpMethod.POST,
          success: true,
          status: HTTP_STATUS.OK.context,
          statusCode: HTTP_STATUS.OK.status,
          path: '/api/v1/books',
          timestamp: '2025-07-02T18:47:46.703Z',
          message: 'book.success.create-book',
          data: {
            id: 1,
            title: 'All you need to know Nestjs',
            isbn: 'IBNSS-25000',
            publishedDate: '2013-01-02T00:00:00.000Z',
            genre: 'Classic',
            authorId: 1,
            author: {
              id: 1,
              firstName: 'Jahid',
              lastName: 'Hiron',
            },
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
          path: '/api/v1/books',
          message: 'Validation Error',
          timestamp: '2025-07-02T18:50:00.000Z',
          errors: [
            {
              field: 'title',
              message: 'Title must be a string',
            },
            {
              field: 'isbn',
              message: 'Isbn must be a string',
            },
          ],
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
                path: '/api/v1/books',
                message: 'Unauthorized',
                timestamp: '2025-07-02T18:51:00.000Z',
              },
            },
            permissionDenied: {
              summary: 'Permission Denied (Insufficient rights)',
              value: {
                success: false,
                method: HttpMethod.POST,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/books',
                message: 'Permission denied',
                timestamp: '2025-07-02T18:52:00.000Z',
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
          path: '/api/v1/books',
          message: 'Internal Server Error',
          timestamp: '2025-07-02T18:53:00.000Z',
        },
      },
    }),
  );
}
