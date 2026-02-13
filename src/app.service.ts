import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccesLog } from './app.schema';
import { Model, Types } from 'mongoose';
import * as useragent from 'useragent';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(@InjectModel(AccesLog.name) private logModel: Model<AccesLog>) {}

  getHello(): string {
    return 'ANOWEB! (0.0.10)';
  }

  async _create(domain: string, info: any) {
    const created = await this.logModel.create({
      domain,
      ips: [{ ...info, count: 1, date: new Date(), updated: new Date() }],
    });
    return { id: String(created._id) };
  }

  _getDeviceInfo(req: Request) {
    const agent = useragent.parse(req.headers['user-agent']);

    const _ip =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

    return {
      ip: _ip.toString(),
      browser: agent.toAgent(),
      os: agent.os.toString(),
      device: agent.device.toString(),
      platform: agent.os.family,
      version: agent.toVersion(),
      userAgent: req.headers['user-agent'],
      language: req.headers['accept-language'],
    };
  }

  async updateAccesLog(
    req: Request,
    id: string,
    domain: string,
  ): Promise<{ id: string }> {
    if (!domain) throw new Error('Domain is required');
    if (typeof domain !== 'string') throw new Error('Invalid domain parameter');

    if (
      domain !== 'me' &&
      domain !== 'web' &&
      domain !== 'm_web' &&
      domain !== 'scan-m_web' &&
      domain !== 'dapp-m_web' &&
      domain !== 'poker_web' &&
      domain !== 'voc' &&
      domain !== 'others'
    )
      throw new Error('Invalid domain parameter');

    const info = this._getDeviceInfo(req);

    //   req?.headers['x-forwarded-for']?.toString().split(',')[0] ||
    //   req?.socket?.remoteAddress;

    if (id === 'new') return this._create(domain, info);

    if (!Types.ObjectId.isValid(id)) throw new Error('Invalid ID');

    const _id = new Types.ObjectId(id);

    const doc =
      id === 'new' ? null : await this.logModel.findOne({ _id, domain }).exec();

    if (!doc) return this._create(domain, info);

    const ipEntry = doc.ips.find((entry) => entry.ip === info.ip);

    if (ipEntry) {
      ipEntry.count += 1;
      ipEntry.updated = new Date();
      console.log(ipEntry);
      console.log(doc.ips);
      console.log(doc);
    } else {
      doc.ips.push({
        count: 1,
        ...info,
        date: new Date(),
        updated: new Date(),
      });
    }

    await doc.save();
    return { id: String(doc._id) };
  }
}
