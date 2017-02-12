db.races.ensureIndex({
  "name": "text",
  "pin.name": "text",
  "type.name": "text",
  "distanceType.name": "text",
  "pin.department.name": "text",
  "pin.department.region": "text"
}, {
  weights: {
    "name": 10,
    "pin.name": 9,
    "type.name": 8,
    "distanceType.name": 7,
    "pin.department.name": 6,
    "pin.department.region": 6
  },
  name: "FullTextIndex"
})


db.races.find({
  $text: {
    $search: "duathlon"
  }
})

db.races.dropIndex("FullTextIndex")


db.races.find({
  name: {
    $regex: /^ds/
  }
}, {
  name: 1,
  id: 1
}).count()

db.races.find({
  $and: [{
    "date": {
      "$gte": start,
      "$lt": end
    }
  }, {
    "type": {
      $or: ["triathlon", "duathlon"]
    }
  }]
});


db.races.ensureIndex( { "place.loc" : "2dsphere" } );

db.races.getIndexes();

db.races.find({$and: [{ "place.loc": { $near: { $geometry: { type: "Point", coordinates: [ 48.856614, 2.352221900000018 ] }, $maxDistance: 60000 } }}]});

db.races.find( { "place.loc" :{ $geoWithin :{ $centerSphere :[ [ 47.322047, 5.09 ] , 60 ] } } } )



