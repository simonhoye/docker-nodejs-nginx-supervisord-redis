FROM nginx

RUN mkdir -p /etc/nginx/sites-available/ \
    && mkdir -p /etc/nginx/sites-enabled/

COPY ./docker/nginx/conf/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx/sites-available/* /etc/nginx/sites-available/

# Configure entrypoint script
COPY ./docker/nginx/scripts/ /scripts/
RUN chmod +x /scripts/*

ENTRYPOINT ["/scripts/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
