#!/bin/bash

COMPRESS_FILE=/home/jluccisano/nextrun_backups/compressed/nextrun-backup-$(date +%Y-%m-%d).tar.gz

mongodump -h  ip:port -d nextrun  -o /home/jluccisano/nextrun_backups
tar -zcvf $COMPRESS_FILE /home/jluccisano/nextrun_backups/nextrun
curl -T $COMPRESS_FILE ftp://ip/Volume_2/backup/backup_nextrun/ --user login:password
