import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class CICDService {
  constructor() {}

  async deploy(app: string): Promise<any> {
    console.log(new Date() + ' Deploying ' + app);

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

    try {
      const { stdout, stderr } = await execAsync(cmd);

      if (stderr) {
        throw new HttpException(
          { error: 'Command error', details: stderr },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      console.log(new Date() + ' Complated ' + app);
      return { output: stdout.trim() };
    } catch (err: any) {
      console.log(new Date() + ' Failed ' + app);
      throw new HttpException(
        { error: 'Failed to execute command', details: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
