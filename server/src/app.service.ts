import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getAbout(): object {
    try {
      const aboutPath = path.resolve(__dirname, '../../about.json');
      if (!fs.existsSync(aboutPath)) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      const aboutData = fs.readFileSync(aboutPath, 'utf-8');
      return JSON.parse(aboutData);
    } catch (error) {
      throw new HttpException(
          'Error reading about.json file',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
