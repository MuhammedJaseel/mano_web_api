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

    if (app === 'web')
      cmd = `
        cd /opt/ano/ano_web && git pull origin main &&
        rm -rf /var/www/anolabs.site/* && cp -a /opt/ano/ano_web/. /var/www/anolabs.site/
       `; // HTML app
    else if (app === 'app')
      cmd = `
        cd /opt/ano/app && git pull origin main &&
        npm ci && npm run build && pm2 restart app
       `;
    else if (app === 'web-m')
      cmd = `
        cd /opt/ano/mano_web && git pull origin main &&
        npm ci && npm run build && pm2 restart web_m
       `;
    else if (app === 'me')
      cmd = `
        cd /opt/jaseel/me && git pull origin main &&
        npm ci && npm run build && pm2 restart me
       `;
    else if (app === 'rpc1')
      cmd = `
        cd /opt/ano/rpc1 && git pull origin main &&
        npm ci && pm2 restart rpc1
       `;
    else if (app === 'rpc2')
      cmd = `
        cd /opt/ano/rpc2 && git pull origin main &&
        cargo build --release && pm2 restart rpc2
       `;
    else if (app === 'ticket-api')
      cmd = `
        cd /opt/ano/ts/ticket_api && git pull origin main &&
        npm ci && npm run build && pm2 restart ts-api
       `;
    else if (app === 'scan-be')
      cmd = `
        cd /opt/ano/scan_be && git pull origin main &&
        npm ci && pm2 restart scan-be
       `;
    else if (app === 'voc-web')
      cmd = `
        cd /opt/voc/voc_web && git pull origin main &&
        rm -rf /var/www/vocindia.net/* && cp -a /opt/voc/voc_web/. /var/www/vocindia.net/
       `;
    else if (app === 'voc-be')
      cmd = `
        cd /opt/voc/voc_be && git pull origin main &&
        npm ci && npm run build && pm2 restart voc-be
       `;
    else if (app === 'voc-ad')
      cmd = `
        cd /opt/voc/voc_ad && git pull origin main && npm ci && npm run build &&
        rm -rf /var/www/admon.vocindia.net/* && cp -a /opt/voc/voc_ad/dist/. /var/www/admin.vocindia.net/
       `; // Vite APP

    exec(cmd, (error, stdout, stderr) => {
      if (error) console.warn(this.dubaiDateTime(), 'ERROR:', error);
      else if (stderr) console.warn(this.dubaiDateTime(), 'STDERR:', stderr);
      else console.log(this.dubaiDateTime(), 'SUCCES:', stdout);
    });

    return 'Deployed';
  }
}

// cd /opt/voc/voc_be && pm2 start dist/main.js --name 'voc-be'
// cd /opt/ano/ts/ticket_api && pm2 start dist/main.js --name 'ts-api'
// cd /opt/ano/rpc1 && npm ci && pm2 start src/index.js --name 'rpc1'
// cd /opt/ano/scan_be && npm ci && pm2 start src/index.js --name 'scan-be'
// cd /opt/jaseel/me && pm2 start npm --name 'me' -- start
// cd /opt/ano/mano_web &&  pm2 start npm --name 'web_m' -- start
// cd /opt/ano/app && pm2 start dist/main.js --name 'app'



// cd /opt/oplex/qorfin_backend && pm2 start dist/main.js --name "qorfin-backend"
// cd /opt/oplex/qorfin_backend && git pull && npm ci --force && npm run build && pm2 restart "qorfin-backend"

// cd /opt/oplex/qorfin_web && git pull origin main && npm ci && npm run build
// rm -rf /var/www/oplex/qorfin.jaseel.cloud/* && cp -a /opt/oplex/qorfin_web/dist/. /var/www/oplex/qorfin.jaseel.cloud/



// /etc/nginx/sites-available

// sudo nginx -t && sudo systemctl reload nginx

// sudo certbot --nginx -d qorfin.anolabs.site -d qorfin-api.anolabs.site

// sudo ln -s /etc/nginx/sites-available/qorfin /etc/nginx/sites-enabled/qorfin

