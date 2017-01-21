FROM node:7.4.0
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

# Update the repository
RUN apt-get update
# Install Supervisord
RUN apt-get install -y supervisor nano \
    && rm -rf /var/lib/apt/lists/*
# Custom Supervisord config
COPY ./docker/node/conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN npm i -g yarn \
    && yarn global add gulpjs/gulp#4.0

# create the logs dir
RUN mkdir -p /usr/src/app/logs
RUN mkdir -p /usr/src/app/src

# Copy files needed for the build
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
COPY .babelrc /usr/src/app/
COPY .jscsrc /usr/src/app/
COPY .jshintrc /usr/src/app/
COPY .npmignore /usr/src/app/
COPY gulpfile.babel.js /usr/src/app/

RUN yarn \
    && yarn global add gulpjs/gulp#4.0 \
    && npm run build

CMD [ "service", "supervisor", "start" ]