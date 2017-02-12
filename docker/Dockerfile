FROM node:alpine
RUN apk update \
	&& apk add unzip 
RUN npm install -g forever
ADD nextrun.zip /var/opt/nextrun/
WORKDIR /var/opt/nextrun/
RUN mkdir -p /var/log/nextrun
RUN unzip nextrun.zip
RUN rm -f nextrun.zip

ENV NODE_ENV prod
EXPOSE 3000

CMD ["forever", "-al" ,"/var/log/nextrun/forever.log","-o","/var/log/nextrun/out.log","-e","/var/log/nextrun/err.log","server.js"]