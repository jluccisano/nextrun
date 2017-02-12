#!/bin/bash

curl -XDELETE "localhost:9200/_river"
curl -XDELETE "localhost:9200/racesidx_v1"

curl -XPOST "http://localhost:9200/racesidx_v1/" -d '{
  "settings": {
    "analysis": {
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "autocomplete",
          "filter": [
            "standard",
            "lowercase",
            "stop",
            "kstem",
            "nGram"
          ]
        }
      },
      "filter": {
        "nGram": {
          "type": "nGram",
          "min_gram": 3,
          "max_gram": 8
        }
      },
      "tokenizer": {
        "autocomplete": {
          "type": "nGram",
          "min_gram": "3",
          "max_gram": "8",
          "token_chars": [
            "letter",
            "digit",
            "whitespace",
            "punctuation",
            "symbol"
          ]
        }
      }
    }
  }
}'

curl -XPUT "http://localhost:9200/racesidx_v1/race/_mapping" -d '{
  "race": {
    "properties": {
      "name": {
        "type": "multi_field",
        "fields": {
          "name": {
            "type": "string"
          },
          "autocomplete": {
            "type": "string",
            "analyzer": "autocomplete"
          }
        }
      },
      "latlng" : {
        "properties" : {
            "location" : {
                "latlng" : "geo_point",
                "fielddata" : {
                    "format" : "compressed",
                    "precision" : "1cm"
                }
            }
        }
      }
    }
  }
}'

curl -XPUT "http://localhost:9200/_river/race/_meta" -d '{
  "type": "mongodb",
  "mongodb": {
    "servers": [
      {
        "host": "localhost",
        "port": 27017
      }
    ],
    "db": "nextrun",
    "collection": "races"
  },
  "index": {
    "name": "racesidx_v1",
    "type": "race"
  }
}'
