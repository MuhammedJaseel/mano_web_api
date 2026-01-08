import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('acces-status/:id/:from')
  accesLog(@Param('id') id: string, @Param('from') from: string): string {
    return this.appService.updateAccesLog(id, from);
  }
}
