import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class CICDService {
  constructor() {}

  dubaiDateTime() {
    const now = new Date();

    return now
      .toLocaleString('en-GB', {
        timeZone: 'Asia/Dubai',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(',', '');
  }

  async deploy(app: string): Promise<any> {
    console.log(this.dubaiDateTime(), 'DEPLOYING:', app);

    let cmd = '';

    if (app === 'app')
      cmd = `
        cd /opt/ano/app && git pull origin main &&
        npm ci && npm run build && pm2 restart app
       `;
    else if (app === 'ticket-api')
      cmd = `
        cd /opt/ano/ts/ticket_api && git pull origin main &&
        npm ci && npm run build && pm2 restart ts-api
       `;

    exec(cmd, (error, stdout, stderr) => {
      if (error) console.warn(this.dubaiDateTime(), 'ERROR:', error);
      else if (stderr) console.warn(this.dubaiDateTime(), 'STDERR:', stderr);
      else console.log(this.dubaiDateTime(), 'SUCCES', stdout);
    });

    return 'Deployed';
  }
}
