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

<<<<<<< HEAD

=======
>>>>>>> d67b29128e0b4888363b20ee310ef74430271337
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
<<<<<<< HEAD
      "type": {
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
          }
        }
      },
      "distanceType": {
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
          "i18n": {
            "type": "multi_field",
            "fields": {
              "i18n": {
                "type": "string"
              },
              "autocomplete": {
                "type": "string",
                "analyzer": "autocomplete"
              }
            }
          }
        }
      },
      "department": {
        "properties": {
          "code": {
            "type": "multi_field",
            "fields": {
              "code": {
                "type": "string"
              },
              "autocomplete": {
                "type": "string",
                "analyzer": "autocomplete"
              }
            }
          },
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
          "region": {
            "type": "multi_field",
            "fields": {
              "region": {
                "type": "string"
              },
              "autocomplete": {
                "type": "string",
                "analyzer": "autocomplete"
              }
            }
          }
        }
      },
      "latlng": {
        "properties": {
          "location": {
            "type": "geo_point",
            "fielddata": {
              "format": "compressed",
              "precision": "1cm"
            }
          }

=======
      "pin" : {
        "properties" : {
            "location" : {
                "type" : "geo_point",
                "fielddata" : {
                    "format" : "compressed",
                    "precision" : "1cm"
                }
            }
>>>>>>> d67b29128e0b4888363b20ee310ef74430271337
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