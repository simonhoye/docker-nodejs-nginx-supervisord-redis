FROM node:7.4.0

WORKDIR /usr/src/app/

# Update the repository
RUN apt-get update
# Install Supervisord
RUN apt-get install -y supervisor \
    && rm -rf /var/lib/apt/lists/*
# Custom Supervisord config
COPY ./docker/node/conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# create the logs dir
RUN mkdir -p /usr/src/app/logs

RUN service supervisor start

RUN npm i -g yarn \
    && npm i -g gulp-cli

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
COPY server.js /usr/src/app/
COPY .babelrc /usr/src/app/
COPY .jscsrc /usr/src/app/
COPY .jshintrc /usr/src/app/
COPY .npmignore /usr/src/app/

RUN yarn

CMD [ "npm", "start" ]
