import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

@Injectable()
export class CICDService {
  constructor() {}

  async deploy(app: string): Promise<any> {
    console.log(Date() + ' Deploying ' + app);

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

    const execAsync = promisify(exec);

    try {
      const { stdout, stderr } = await execAsync(cmd);
      if (stderr) console.warn(new Date(), 'STDERR:', stderr);
      console.log(new Date(), 'Success', app);
      return { success: true, output: stdout.trim() };
    } catch (err: any) {
      console.error(new Date(), 'Failed', app, err);
      return { success: false, error: err.message };
    }
  }
}
