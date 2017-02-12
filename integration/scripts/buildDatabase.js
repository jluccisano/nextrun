db.races.ensureIndex({ "place.geo" : "2dsphere" });
db.routes.ensureIndex({ "startPlace.geo" : "2dsphere" });