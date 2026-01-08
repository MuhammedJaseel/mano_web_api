import { Controller, Get, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('acces-status/:id/:domain')
  accesLog(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('domain') domain: string,
  ): Promise<{ id: string }> {
    return this.appService.updateAccesLog(req, id, domain);
  }
}
