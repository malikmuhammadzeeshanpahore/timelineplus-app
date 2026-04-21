#!/bin/bash

echo "Configuring PM2 startup..."
env PATH=$PATH:/home/muhammad_zeeshan/.nvm/versions/node/v18.20.8/bin /home/muhammad_zeeshan/.nvm/versions/node/v18.20.8/lib/node_modules/pm2/bin/pm2 startup systemd -u muhammad_zeeshan --hp /home/muhammad_zeeshan
pm2 save

echo "Backing up Nginx config..."
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak

echo "Updating Nginx configuration..."
# Copy the local config (which has 'user muhammad_zeeshan;' added) to the system config
sudo cp /home/muhammad_zeeshan/Documents/Zeeshan/timeline-earn/nginx.conf /etc/nginx/nginx.conf

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Done! Server should now persist across restarts and having correct permissions."

echo "Starting server..."
pm2 start timeline-earn

echo "Saving process list..."
pm2 save

echo "Start Cloudflared"
cloudflared tunnel run
