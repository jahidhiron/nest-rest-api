import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function ChangePasswordSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Change user password',
      description:
        'Allows an authenticated user to change their password by providing their current password and a new password. The new password must be different from the old one.',
    }),
    ApiBody({ type: ChangePasswordDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Password changed successfully',
    }),
    ApiBadRequestResponse({
      description: 'Validation Error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.BAD_REQUEST.context,
          statusCode: HTTP_STATUS.BAD_REQUEST.status,
          path: '/api/v1/auth/change-password',
          message: 'Validation Error',
          timestamp: '2025-06-30T08:22:48.382Z',
          errors: [
            {
              field: 'oldPassword',
              message: 'Old password should not be empty',
            },
            {
              field: 'newPassword',
              message: 'New password must be different from old password',
            },
          ],
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.UNAUTHORIZED.context,
          statusCode: HTTP_STATUS.UNAUTHORIZED.status,
          path: '/api/v1/auth/change-password',
          message: 'Unauthorized',
          timestamp: '2025-07-02T11:31:35.041Z',
        },
      },
    }),
    ApiForbiddenResponse({
      description: "Old password doesn't match",
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.FORBIDDEN?.context ?? 'FORBIDDEN',
          statusCode: 403,
          path: '/api/v1/auth/change-password',
          message: "Old password doesn't match",
          timestamp: '2025-07-02T11:32:48.020Z',
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
          path: '/api/v1/auth/change-password',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
