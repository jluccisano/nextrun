db.races.aggregate({
  "$match": {
    "$and": [{
      "department.code": {
        "$in": ["11"]
      }
    }, {
      "published": true
    }]
  }
}, {
  "$group": {
    "_id": "$all",
    "minDate": { $min: "$date"},
    "maxDate": { $max: "$date"}
  }
});