import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AccesLog, AccesLogSchema } from './app.schema';
import { CICDService } from './ci-cd.service';
import { MailService } from './mail.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time to live in milliseconds (e.g., 60 seconds)
        limit: 100, // Default max requests per ttl window across the app
      },
    ]),
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: process.env.MONGO_URI }),
    }),
    MongooseModule.forFeature([
      { name: AccesLog.name, schema: AccesLogSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, CICDService, MailService],
})
export class AppModule {}
