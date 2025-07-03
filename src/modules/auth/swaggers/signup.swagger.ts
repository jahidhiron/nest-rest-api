import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { SignupDto } from '../dtos/signup.dto';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function SignupSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description: `This endpoint allows a user to register by providing their first name, last name, email, password, and role.

**Important Note:**  
If the user role is set to \`author\`, an associated author profile will be automatically created behind the scenes.`,
    }),
    ApiBody({ type: SignupDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Signup successful',
      schema: {
        example: {
          method: HttpMethod.POST,
          success: true,
          status: HTTP_STATUS.CREATED.context,
          statusCode: HTTP_STATUS.CREATED.status,
          path: '/api/v1/auth/signup',
          timestamp: '2025-06-30T08:22:31.685Z',
          message: 'Signup successful',
          data: {
            id: 12,
            firstName: 'Jahid',
            lastName: 'Hiron',
            email: 'test@gmail.com',
            role: 'author',
            verified: false,
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
          path: '/api/v1/auth/signup',
          message: 'Validation Error',
          timestamp: '2025-06-30T08:21:51.772Z',
          errors: [
            { field: 'firstName', message: 'First name should not be empty' },
            { field: 'lastName', message: 'Last name should not be empty' },
            { field: 'email', message: 'Email must be an email' },
            {
              field: 'password',
              message: 'Password must be longer than or equal to 6 characters',
            },
            {
              field: 'role',
              message:
                'Role must be one of the following values: admin, author, user',
            },
          ],
        },
      },
    }),
    ApiConflictResponse({
      description: 'User already exists',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.CONFLICT.context,
          statusCode: HTTP_STATUS.CONFLICT.status,
          path: '/api/v1/auth/signup',
          message: 'Email already exist',
          timestamp: '2025-06-30T08:22:48.382Z',
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
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
          path: '/api/v1/auth/signup',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
