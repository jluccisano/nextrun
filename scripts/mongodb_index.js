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


db.races.ensureIndex( { "place.geo" : "2dsphere" } );

db.races.getIndexes();

db.races.find({$and: [{ "place.geo": { $near: { $geometry: { type: "Point", coordinates: [ 43.554954, 1.500864 ] }, $maxDistance: 60000 } }}]});

db.races.find( { "place.geo" :{ $geoWithin :{ $centerSphere :[ [ 47.322047, 5.09 ] , 60 ] } } } )

db.users.update({ email: "joseph.luccisano@gmail.com"}, { $set: { "role" : { "bitMask" : 4, "title" : "admin" } }}, {upsert: false});

sudo mongofiles --host 192.95.25.173 --port 27017 -d nextrun get reward.sql --local .

