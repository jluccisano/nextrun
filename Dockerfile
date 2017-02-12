FROM node:7.4.0-alpine
RUN apk update \
	&& apk add unzip
ADD dist/nextrun.zip /var/opt/nextrun
RUN mkdir -p /var/opt/nextrun
WORKDIR /var/opt/nextrun
RUN unzip nextrun.zip .
RUN rm nextrun.zip

EXPOSE 3000