db.races.aggregate({
  '$match': {
    '$and': [{
      'department.code': {
        '$in': ['11']
      }
    }, {
      published: true
    }]
  }
}, {
  '$group': {
    _id: '$all',
    total: {
      '$sum': 1
    },
    races: {
      '$push': {
        "_id": "$_id",
        "name": "$name",
        "type": "$type",
        "date": "$date",
        "department": "$department"
      }
    }
  }
}, {
  "$unwind": "$races"
}, {
  "$project": {
    "_id": "$races._id",
    "name": "$races.name",
    "type": "$races.type",
    "department": "$races.department",
    "date": "$races.date",
    "total": "$total"
  }
}, {
  "$skip": 0
}, {
  "$limit": 100
}, {
  "$sort": {
    name: 1
  }
}, {
  "$group": {
    "_id": "$total",
    "results": {
      "$push": {
        "_id": "$_id",
        "name": "$name",
        "type": "$type",
        "date": "$date",
        "department": "$department"
      }
    },
    "size": {
      "$sum": 1
    }
  }
}, {
  "$project": {
    "_id": 0,
    "results": 1,
    "total": "$_id",
    "size": 1
  }
});


