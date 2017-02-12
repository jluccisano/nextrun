curl -XPOST "http://localhost:9200/racesidx_v1/race" -d '{
  "query": {
    "bool": {
      "must": [
        {
          "query_string": {
            "default_field": "race.name.autocomplete",
            "query": "dua"
          }
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 10,
  "sort": [],
  "filter": {
    "geo_distance": {
      "distance": "40km",
      "race.pin.location": {
        "lat": 43,
        "lon": 1.95
      }
    }
  }
}'