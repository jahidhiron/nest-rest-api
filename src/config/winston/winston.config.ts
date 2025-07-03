import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import {
  LOG_ERROR_FILE,
  LOG_DIR,
  LOG_SUCCESS_FILE,
  LOG_LEVEL,
  HTTP_STATUS,
} from '@/shared';
import { ConfigService } from '../config.service';

export const createWinstonConfig = (
  configService: ConfigService,
): winston.LoggerOptions => {
  const prod = configService.app.port;

  const onlyHttpSuccess = winston.format((info) =>
    info.context === HTTP_STATUS.OK.context ? info : false,
  );

  const onlyErrors = winston.format((info) =>
    info.level === LOG_LEVEL.ERROR ? info : false,
  );

  return {
    transports: [
      // Console transport
      new winston.transports.Console({
        level: prod ? LOG_LEVEL.INFO : LOG_LEVEL.DEBUG,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          nestWinstonModuleUtilities.format.nestLike('App', {
            prettyPrint: true,
          }),
        ),
      }),

      // File transports for error
      new winston.transports.File({
        filename: path.join(LOG_DIR, LOG_ERROR_FILE),
        level: LOG_LEVEL.ERROR,
        format: winston.format.combine(
          onlyErrors(),
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),

      // File transports for success
      new winston.transports.File({
        filename: path.join(LOG_DIR, LOG_SUCCESS_FILE),
        level: LOG_LEVEL.INFO,
        format: winston.format.combine(
          onlyHttpSuccess(),
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  };
};
