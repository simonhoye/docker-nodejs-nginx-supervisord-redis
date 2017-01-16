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

- visit http://localhost:9001 to view status of supervisord jobs
- Hit port 8080 for Node.js server directly, or port 80 to be load balanced by Nginx

## Scale

Change the docker-compose.yml to add more node containers (with thier own ports), enable them in the nginx.conf
