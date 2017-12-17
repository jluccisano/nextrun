[![Build Status](https://travis-ci.org/jluccisano/nextrun.svg?branch=develop)](https://travis-ci.org/jluccisano/nextrun)

### Architecture Overview

![Architecture Overview](https://jluccisano.github.io/assets/images/nextrun-architecture.png)

### Build

1. Install Nodejs https://nodejs.org/en/download/package-manager/

2. Latest Npm

```bash
sudo npm install npm@latest -g
```

3. Install java

```bash
sudo apt-get install openjdk-8-jdk
```
4. Grunt

```bash
sudo npm install grunt-cli -g
```

5. Bower
```bash
 sudo npm install -g bower
 bower install
```
6. Install Compass

See: http://compass-style.org/install/

```bash
sudo apt-get install ruby-full
sudo gem update --system
sudo gem install compass
```
7. Node inspector

```bash
sudo npm install -g node-inspector 
```

8. Build

```bash
npm install
grunt build
```

### Docker

#### Build

```bash
 docker build -t jluccisano/nextrun ./docker
```

#### Run

```bash
docker run  -dit --name mongo -p 27017:27017 -v /data/db:/data/db mongo
docker run -dit --name nextrun -p 4000:3000 -e NODE_ENV=prod --link  mongo:mongo jluccisano/nextrun
```
### Redirect port

```bash
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 4000
```


