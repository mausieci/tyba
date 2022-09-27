import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Api test for TYBA by Mauricio Sierra Cifuentes 🚀 ';
  }
}
