docker run  -dit --name mongo -p 27017:27017 -v /data/db:/data/db mongo
docker run -dit --name nextrun -p 4000:3000 -e NODE_ENV=prod --link  mongo:mongo nextrun