import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { CICDService } from './ci-cd.service';
import { MailService } from './mail.service';
import { Throttle } from '@nestjs/throttler';
import { CorsInterceptor } from './cors.interceptor';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cicdService: CICDService,
    private readonly mailService: MailService,
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
  webhookCICD(@Param('app') app: string, @Body() body: any): Promise<any> {
    return this.cicdService.deploy(app);
  }

  // @SkipThrottle()
  @Post('yelmas/enquiry')
  @Throttle({ default: { limit: 6, ttl: 60000 } })
  @UseInterceptors(new CorsInterceptor('https://yelmas.ae'))
  sendMail(
    @Body()
    body: {
      name: string;
      email: string;
      phone: string;
      message: string;
    },
  ) {
    try {
      this.mailService.sendMail(
        'jaseelmanamulli@gmail.com',
        'New Enquiry - Yelmas',
        '',
        this.mailService.yelmasTemplate(body),
      );
      this.mailService.sendMail(
        'yelmaspropertiesllc@gmail.com',
        'New Enquiry - Yelmas',
        '',
        this.mailService.yelmasTemplate(body),
      );
    } catch (error) {}
    return { success: true, v: '0.0.2' };
  }
}
