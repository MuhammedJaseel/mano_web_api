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
        cd /opt/ano/tc/ticket-api && git pull origin main &&
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

      console.log('Current dir:', stdout.trim());
      return stdout.trim();
    });

    return 'Deployment started';
  }
}
