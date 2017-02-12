/**
	describe('function()', function() {

		it('should return OK', function(done) {

		});

		it('should return NOK', function(done) {

		});
	});
**/

process.env.NODE_ENV = 'test';
process.env.PORT= 4000;

var chai = require('chai'),
	expect = chai.expect,
	errorUtils = require('../../../app/utils/errorUtils');

describe('ErrorUtils', function() {

	describe('errors()', function() {

		it('invalid parameters', function(done) {
			var result = errorUtils.errors(null);
			expect(result).to.be.an('array');
			expect(result[0]).to.equal('Oops! There was an error');


			var result1 = errorUtils.errors(undefined);
			expect(result1).to.be.an('array');
			expect(result1[0]).to.equal('Oops! There was an error');

			var result2 = errorUtils.errors({
				error: 'error'
			});
			expect(result2).to.be.an('array');
			expect(result2[0]).to.equal('Oops! There was an error');

			var result3 = errorUtils.errors({});
			expect(result3).to.be.an('array');
			expect(result3[0]).to.equal('Oops! There was an error');

			done();
		});


		it('valid parameters', function(done) {

			var result = errorUtils.errors({
				error: {
					message: 'error'
				}
			});
			expect(result).to.be.an('array');
			expect(result[0]).to.equal('error');

			done();

		});

	});

});