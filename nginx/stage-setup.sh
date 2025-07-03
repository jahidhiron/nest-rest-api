#!/bin/bash

sudo tee /etc/nginx/conf.d/api.conf > /dev/null <<'EOF'
server {
    server_name api.staging.test.developertroop.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        client_max_body_size 100M;

        proxy_connect_timeout 1200s;
        proxy_send_timeout 1200s;
        proxy_read_timeout 1200s;
        send_timeout 1200s;
    }

    listen 443 ssl;                       
    ssl_certificate /etc/letsencrypt/live/api.staging.test.developertroop.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.staging.test.developertroop.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;  
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;     
}

server {
    if ($host = api.staging.test.developertroop.com) {
        return 301 https://$host$request_uri;
    } 

    server_name api.staging.test.developertroop.com;
    listen 80;
    return 404;                           
}
EOF

# Reload NGINX
sudo nginx -t && (sudo systemctl reload nginx || sudo systemctl restart nginx)
