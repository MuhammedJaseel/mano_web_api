import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccesLog } from './app.schema';
import { Model, Types } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(@InjectModel(AccesLog.name) private logModel: Model<AccesLog>) {}

  getHello(): string {
    return 'ANOWEB! (0.0.8)';
  }

  async _create(domain: string, ip: string) {
    const created = await this.logModel.create({
      domain,
      ips: [{ ip, count: 1, date: new Date(), updated: new Date() }],
    });
    return { id: String(created._id) };
  }

  async updateAccesLog(
    req: Request,
    id: string,
    domain: string,
  ): Promise<{ id: string }> {
    if (!domain) throw new Error('Domain is required');
    if (typeof domain !== 'string') throw new Error('Invalid domain parameter');

    if (
      domain !== 'web' &&
      domain !== 'm_web' &&
      domain !== 'scan-m_web' &&
      domain !== 'dapp-m_web' &&
      domain !== 'poker_web'
    )
      throw new Error('Invalid domain parameter');

    const ip =
      req?.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req?.socket?.remoteAddress;

    if (id === 'new') return this._create(domain, ip);

    if (!Types.ObjectId.isValid(id)) throw new Error('Invalid ID');

    const _id = new Types.ObjectId(id);

    const doc =
      id === 'new' ? null : await this.logModel.findOne({ _id, domain }).exec();

    if (!doc) return this._create(domain, ip);

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
