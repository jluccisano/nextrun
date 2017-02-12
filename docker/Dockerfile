FROM node:alpine
RUN apk update \
	&& apk add unzip

RUN mkdir -p /var/opt/nextrun
RUN mkdir -p /var/log/nextrun
WORKDIR /var/opt/nextrun
ADD nextrun.zip .
RUN unzip nextrun.zip
RUN rm nextrun.zip
RUN npm install -g forever
EXPOSE 3000
CMD ["forever", "-al" ,"/var/log/nextrun/forever.log","-o","/var/log/nextrun/out.log","-e","/var/log/nextrun/err.log","server.js"]
