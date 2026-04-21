module.exports = {
  apps: [
    {
      name: 'timeline-backend',
      script: 'npm',
      args: 'run start',
      cwd: '/home/muhammad_zeeshan/Documents/Zeeshan/timeline-earn',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'timeline-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/muhammad_zeeshan/Documents/Zeeshan/timeline-earn',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'cloudflare-tunnel',
      script: '/usr/local/bin/cloudflared',
      args: 'tunnel run cd554993-26aa-4b6c-8ff0-dcde219808ac',
      cwd: '/home/muhammad_zeeshan/Documents/Zeeshan/timeline-earn'
    }
  ]
};
