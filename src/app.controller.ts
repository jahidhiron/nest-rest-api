import { Controller } from '@nestjs/common';
import { ModuleName } from './common/enums';

@Controller(ModuleName.Auth)
export class AppController {
  getHome() {
    return 'Welcome to the Book Store API!';
  }
}
