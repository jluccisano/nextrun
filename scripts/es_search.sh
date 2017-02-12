#!/bin/bash

curl -XPOST "http://localhost:9200/racesidx_v1/race/_search" -d '{
  "partial_fields": {
    "partial1": {
      "exclude": "routes.*"
    }
  },
  "query": {
    "bool": {
      "should": [
        {
          "query_string": {
            "default_field": "race.name.autocomplete",
            "query": "lon"
          }
        },
        {
          "query_string": {
            "default_field": "race.department.name.autocomplete",
            "query": "lon"
          }
        },
        {
          "query_string": {
            "default_field": "race.department.region.autocomplete",
            "query": "lon"
          }
        },
        {
          "query_string": {
            "default_field": "race.department.code.autocomplete",
            "query": "lon"
          }
        },
        {
          "query_string": {
            "default_field": "race.distanceType.i18n.autocomplete",
            "query": "lon"
          }
        },
        {
          "query_string": {
            "default_field": "race.type.name.autocomplete",
            "query": "lon"
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
        "terms": {
          "race.department.code": [
            "11",
            "31"
          ]
        }
      },
      {
        "terms": {
          "race.type.name": [
            "duathlon"
          ]
        }
      },
      {
        "range": {
          "race.date": {
            "from": "2008-01-01",
            "to": "2014-12-13"
          }
        }
      },
      {
        "geo_distance": {
          "distance": "35km",
          "race.pin.location": {
            "lat": "43.430328",
            "lon": "1.698712"
          }
        }
      }
    ]
  },
  "facets": {
    "departementFacets": {
      "terms": {
        "field": "race.department.code",
        "order": "term",
        "all_terms": false
      },
      "facet_filter": {
        "and": [
          {
            "terms": {
              "race.type.name": [
                "duathlon"
              ]
            }
          },
          {
            "geo_distance": {
              "distance": "35km",
              "race.pin.location": {
                "lat": "43.430328",
                "lon": "1.698712"
              }
            }
          }
        ]
      }
    },
    "typeFacets": {
      "terms": {
        "field": "race.type.name",
        "order": "term",
        "all_terms": false
      },
      "facet_filter": {
        "and": [
          {
            "terms": {
              "race.department.code": [
                "11",
                "31"
              ]
            }
          },
          {
            "geo_distance": {
              "distance": "35km",
              "race.pin.location": {
                "lat": "43.430328",
                "lon": "1.698712"
              }
            }
          }
        ]
      }
    }
  }
}' | python -mjson.tool
