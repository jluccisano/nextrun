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
  "sort": ["_score"],
  "filter": {
    "and": [
      {
        "terms": {
          "race.department.code": [
            "11"
          ]
        }
      },
      {
        "terms": {
          "race.type.name": [
            "duathlon"
          ]
        }
      }
    ]
  },
  "facets": {
    "departementFacets": {
      "terms": {
        "field": "race.department.code",
        "order": "term",
        "all_terms": true
      },
      "facet_filter": {
        "and": [
          {
            "terms": {
              "race.type.name": [
                "duathlon"
              ]
            }
          }
        ]
      }
    },
    "typeFacets": {
      "terms": {
        "field": "race.type.name",
        "order": "term",
        "all_terms": true
      },
      "facet_filter": {
        "and": [
          {
            "terms": {
              "race.department.code": [
                "11"
              ]
            }
          }
        ]
      }
    }
  }
}' | python -mjson.tool
