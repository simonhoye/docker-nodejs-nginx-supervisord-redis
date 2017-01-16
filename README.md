# node-rewards

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

## Scale

Change the docker-compose.yml to add more node containers (with thier own ports), enable them in the nginx.conf

## Running without docker on Ubuntu

- Install redis `apt-get install redis-server -y`
- Edit `/etc/hosts` to add "redis" hostname for 127.0.0.1
- Install yarn `npm i yarn -g`
- Get dependancies running `yarn`
- Install Gulp4 `yarn global add gulpjs/gulp#4.0`
- Start redis `service redis-server start` 
- Install supervisor `apt-get install supervisor -y`
- Run `mkdir /usr/src/app`
- Create a symbolic link to you cloned repo `ln -s /path/to/node-rewards /usr/src/app`
- Start supervisor `nohup /usr/bin/supervisord -c /path/to/node-rewards/docker/node/conf/supervisord.conf &`
- Check the node server and npm watch services http://localhost:9001/ (username and password are configured in supervisor.conf)