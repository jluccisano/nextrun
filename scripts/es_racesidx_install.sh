#!/bin/bash

echo index name $1


if [ $1 == "" || $2 == "" || $3 == "" ]; then
  echo "no argument supplied"
  exit 1
fi

curl -XDELETE "localhost:9200/_river"
curl -XDELETE "localhost:9200/$1"

curl -XPOST "http://localhost:9200/$1" -d '{
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

curl -XPUT "http://localhost:9200/$1/race/_mapping" -d '{
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
      "pin": {
        "properties": {
          "location": {
            "type": "geo_point",
            "fielddata": {
              "format": "compressed",
              "precision": "1cm"
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
        "host": "'"$3"'",
        "port": 27017
      }
    ],
    "db": "'"$2"'",
    "collection": "races"
  },
  "index": {
    "name": "'"$1"'",
    "type": "race"
  }
}'
