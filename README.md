# docker-nodejs-nginx-supervisord-redis

## What this is

- Docker compose Node.js, Nginx, supervisord, and Redis
- Docker network configured ready to link with other Docker compose projects
- node 7.4
- nginx reverse proxy (and load balanced)
- gulp4 (with Babel)

## Installation

- clone
- run `docker-compose -f docker-compose.yml -f docker-compose-dev.yml up -d`

## Next steps

- Check the node server and npm watch services http://localhost:9001/ (username and password are configured in supervisor.conf)

![supervisor](https://github.com/chrisdlangton/node-rewards/blob/master/build/github/supervisor.png?raw=true)

- Hit port 8080 for Node.js server directly, or port 80 to be load balanced by Nginx
- Status of supervisord services `docker-compose exec node supervisorctl`
- Tail the logs `docker-compose exec node supervisorctl tail -f node-server`
- Start a single supervisord service `docker-compose exec node supervisorctl start node-server`
- Stop a single supervisord service `docker-compose exec node supervisorctl stop node-server`
- Restart a single supervisord service `docker-compose exec node supervisorctl restart node-server`
- Reload the supervisord config `docker-compose exec node supervisorctl reload`

## Scale

Change the docker-compose.yml to add more node containers (with thier own ports), enable them in the nginx.conf

## Setup for Ubuntu (without docker) or WSL (Windows Subsystem for Linux)

- Install redis `apt-get install redis-server -y`
- Edit `/etc/hosts` to add "redis" hostname for 127.0.0.1
- Install yarn `npm i yarn -g`
- Get dependancies running `yarn`
- Install Gulp4 `yarn global add gulpjs/gulp#4.0`
- Start redis `service redis-server start` 
- Install supervisor `apt-get install supervisor -y`
- Run `mkdir /usr/src/app`
- Create a symbolic link to you cloned repo `ln -s /path/to/repo/docker-nodejs-nginx-supervisord-redis /usr/src/app`
- Start supervisor `nohup /usr/bin/supervisord -c /path/to/repo/docker-nodejs-nginx-supervisord-redis/docker/node/conf/supervisord.conf &`
- Check the node server and npm watch services http://localhost:9001/ (username and password are configured in supervisor.conf)

