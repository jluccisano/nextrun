#!/bin/bash

URI=$1

GOOGLE_BOT_UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

curl -i -A "${GOOGLE_BOT_UA}" http://nextrun.fr/${URI}


#curl -i http://nextrun.fr/about/?_escaped_fragment_=

