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
    "_id": "$department.code",
    "total": {
      "$sum": 1
    }
  }
});