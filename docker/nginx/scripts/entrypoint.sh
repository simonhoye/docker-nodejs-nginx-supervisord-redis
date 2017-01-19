#!/usr/bin/env bash

sites_available=/etc/nginx/sites-available
sites_enabled=/etc/nginx/sites-enabled

# Reset to initial state
rm -rf $sites_enabled/*

# Copy across appropriate environment configuration
ln -s $sites_available/$NODE_ENV.conf $sites_enabled

# Default nginx starting commands
# As per https://github.com/nginxinc/docker-nginx/blob/8921999083def7ba43a06fabd5f80e4406651353/mainline/jessie/Dockerfile
nginx -g "daemon off;"