db.races.aggregate({
  '$match': {
    '$and': [{
      'department.code': {
        '$in': ['11']
      }
    }, {published: true}]
  }
}, {
  '$group': {
    _id: '$date',
    races: {
      '$push': {
        "_id": "$_id",
        "name": "$name",
        "type": "$type",
        "department": "$department"
      }
    }
  }
});