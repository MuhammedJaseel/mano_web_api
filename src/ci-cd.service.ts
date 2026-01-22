import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class CICDService {
  constructor() {}

  deploy(app: string): string {
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

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Error:', error.message);
        return error.message;
      }

      if (stderr) {
        console.error('Stderr:', stderr);
        return stderr;
      }

      console.log(Date() + ' Complated ' + app);
      // console.log('Current dir:', stdout.trim());
      return stdout.trim();
    });

    // try {
    //   const { stdout, stderr } = await execAsync(cmd);

    //   if (stderr) {
    //     throw new HttpException(
    //       { error: 'Command error', details: stderr },
    //       HttpStatus.INTERNAL_SERVER_ERROR,
    //     );
    //   }
    //   console.log(new Date() + ' Complated ' + app);
    //   return { output: stdout.trim() };
    // } catch (err: any) {
    //   console.log(new Date() + ' Failed ' + app);
    //   throw new HttpException(
    //     { error: 'Failed to execute command', details: err.message },
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }

    return 'Deployment Complated';
  }
}
