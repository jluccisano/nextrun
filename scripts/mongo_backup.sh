#!/bin/bash

COMPRESS_FILE=/home/jluccisano/nextrun_backups/compressed/nextrun-backup-$(date +%Y-%m-%d).tar.gz

mongodump -h  192.95.25.173:27017 -d nextrun  -o /home/jluccisano/nextrun_backups
tar -zcvf $COMPRESS_FILE /home/jluccisano/nextrun_backups/nextrun
curl -T $COMPRESS_FILE ftp://81.56.136.120/Volume_2/backup/backup_nextrun/ --user jluccisano:malili011004 
