docker run -it -d -p 8082:3000 --name nextrun nextrun 



docker-compose up --name nextrun --force-recreate


docker rmi container-id
docker-compose build
docker-compose up -d --force-recreate

 forever start -al /var/log/nextrun/forever.log -o /var/log/nextrun/out.log -e /var/log/nextrun/err.log server.js