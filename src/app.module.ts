import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AccesLog, AccesLogSchema } from './app.schema';
import { CICDService } from './ci-cd.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: process.env.MONGO_URI }),
    }),
    MongooseModule.forFeature([
      { name: AccesLog.name, schema: AccesLogSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, CICDService],
})
export class AppModule {}
