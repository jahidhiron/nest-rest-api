import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function BookDetailDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get book detail',
      description: 'Fetch detailed information of a book by its ID.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Get book detail successful',
      schema: {
        example: {
          method: HttpMethod.GET,
          success: true,
          status: HTTP_STATUS.OK.context,
          statusCode: HTTP_STATUS.OK.status,
          path: '/api/v1/books/1',
          timestamp: '2025-07-02T20:02:33.772Z',
          message: 'Get book detail successful',
          data: {
            id: 1,
            title: 'Test 1 update',
            isbn: 'IBNSS-250014',
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
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.GET,
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
          path: '/api/v1/books/1',
          message: 'Internal Server Error',
          timestamp: '2025-07-02T20:02:33.772Z',
        },
      },
    }),
  );
}
