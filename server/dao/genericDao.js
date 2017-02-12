module.exports = {

	deleteById: function(id, cb) {
		this.remove({
			_id: id
		}).exec(cb);
	},

	findById: function(id, cb) {
		this.findOne({
			_id: id
		}).exec(cb);
	},

	findOneByCriteria: function(criteria, projection, cb) {
		this.findOne(criteria, projection).exec(cb);
	},

	findByCriteria: function(criteria, cb, projection, limit, skip) {

		var query = this.find(criteria, projection);

		if (limit) {
			query.limit(limit);
		}

		if (skip) {
			query.skip(skip);
		}

		query.exec(cb);
	},

	deleteByCriteria: function(criteria, cb) {
		this.remove(criteria).exec(cb);
	},
};