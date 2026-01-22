import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { exec } from 'child_process';

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

  @Post('/webhook/ci-cd')
  webhookCICD(@Body() body: any) {
    exec(`
       cd /var/www/myapp &&
       git pull origin main 
    `);
    console.log('Web hook called');
    console.log(body);
    return 'Deployment started';
  }
}
