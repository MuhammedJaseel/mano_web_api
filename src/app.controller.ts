import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { CICDService } from './ci-cd.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cicdService: CICDService,
  ) {}

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

  @Post('/webhook/ci-cd/:app')
  webhookCICD(@Param('app') app: string, @Body() body: any) {
    return this.cicdService.deploy(app);
  }
}
