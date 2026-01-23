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
      if (stderr) throw stderr;
      return stdout.trim();
    } catch (err) {
      throw new HttpException(
        { error: 'Failed to deploy', details: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // exec(cmd, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error('Error:', error.message);
    //     return error.message;
    //   }

    //   if (stderr) {
    //     console.error('Stderr:', stderr);
    //     return stderr;
    //   }

    //   console.log(Date() + ' Complated ' + app);
    //   // console.log('Current dir:', stdout.trim());
    //   return stdout.trim();
    // });
  }
}
