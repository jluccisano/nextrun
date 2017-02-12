#!/bin/bash

curl -XPOST "http://localhost:9200/racesidx_v1/race/_search" -d '{
  "fields": [
    "name",
    "distanceType",
    "type",
    "department",
    "_id"
  ],
  "query": {
    "bool": {
      "should": [
        {
          "query_string": {
            "default_field": "race.department.name.autocomplete",
            "query": "dua"
          }
        },
        {
          "query_string": {
            "default_field": "race.department.region.autocomplete",
            "query": "du"
          }
        },
        {
          "query_string": {
            "default_field": "race.department.code.autocomplete",
            "query": "du"
          }
        },
        {
          "query_string": {
            "default_field": "race.distanceType.i18n.autocomplete",
            "query": "du"
          }
        },
        {
          "query_string": {
            "default_field": "race.type.name.autocomplete",
            "query": "dua"
          }
        }
      ]
    }
  },
  "from": 0,
  "size": 10,
  "sort": [
    "_score"
  ],
  "filter": {
    "and": [
      {
        "term": {
          "race.published": true
        }
      },
      {
        "terms": {
          "race.department.code": [
            "11"
          ]
        }
      }
    ]
  }
}' | python -mjson.tool
