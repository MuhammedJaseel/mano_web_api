import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccesLog } from './app.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(AccesLog.name) private logModel: Model<AccesLog>) {}

  getHello(): string {
    return 'ANOWEB! (0.0.1)';
  }

  async updateAccesLog(id: string, from: string): Promise<{ id: string }> {
    if (Types.ObjectId.isValid(id)) {
      await this.logModel
        .findByIdAndUpdate(id, { $push: { ip: from } }, { new: true })
        .exec();
      return { id };
    }

    const newLog = new this.logModel({
      domain: id,
      ip: [from],
    });

    await newLog.save();

    return { id: '' };
  }
}
