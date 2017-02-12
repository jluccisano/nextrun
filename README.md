### Build

1. Install Nodejs https://nodejs.org/en/download/package-manager/

2. Latest Npm

```bash
sudo npm install
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

5. Build

```bash
grunt build
```

### Docker

#### Run

```bash
docker run  -dit --name mongo -p 27017:27017 -v /data/db:/data/db mongo
docker run -dit --name nextrun -p 4000:3000 -e NODE_ENV=prod --link  mongo:mongo nextrun
```




