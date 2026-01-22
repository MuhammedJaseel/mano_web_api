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
        cd /opt/an0/app && git pull origin main &&
        npm ci && npm run build && pm2 restart app
       `;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Error:', error.message);
        return;
      }

      if (stderr) {
        console.error('Stderr:', stderr);
        return;
      }

      console.log('Current dir:', stdout.trim());
    });

    return 'Deployment started';
  }
}
