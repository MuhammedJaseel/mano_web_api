import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccesLog } from './app.schema';
import { Model, Types } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(@InjectModel(AccesLog.name) private logModel: Model<AccesLog>) {}

  getHello(): string {
    return 'ANOWEB! (0.0.1)';
  }

  async updateAccesLog(
    req: Request,
    id: string,
    domain: string,
  ): Promise<{ id: string }> {
    switch (domain) {
      case 'web':
        break;
      case 'm.web':
        break;
      case 'scan-m.web':
        break;
      case 'dapp-m.web':
        break;
      case 'poker.web':
        break;
      default:
        throw new Error('Invalid from parameter');
    }

    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress;

    const _id = new Types.ObjectId(id);

    const doc = await this.logModel.findOne({ _id, domain }).exec();

    if (!doc) {
      const created = await this.logModel.create({
        _id,
        domain,
        ips: [{ ip, count: 1, date: new Date(), updated: new Date() }],
      });
      return { id: String(created._id) };
    }

    const ipEntry = doc.ips.find((entry) => entry.ip === ip);

    if (ipEntry) {
      ipEntry.count += 1;
      ipEntry.updated = new Date();
    } else {
      doc.ips.push({ ip, count: 1, date: new Date(), updated: new Date() });
    }

    await doc.save();
    return { id: String(doc._id) };
  }
}
