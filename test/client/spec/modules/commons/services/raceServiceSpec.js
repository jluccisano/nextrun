describe('RaceServices', function() {

	var $httpBackend, RaceServices, mockRace, mockRestAPIHelper;

	beforeEach(module('restAPI', function($provide) {
		mockRestAPIHelper = jasmine.createSpyObj('RestAPIHelper', ['sendPOST', 'sendGET', 'sendDELETE', 'sendPUT']);
		$provide.value('RestAPIHelper', mockRestAPIHelper);
	}));

	beforeEach(inject(function(_RaceServices_) {
		RaceServices = _RaceServices_;

		mockRace = {
			name: "Duathlon de Castelnaudary"
		}
	}));

	describe('create', function() {
		it('should call sendPOST with success', function() {
			RaceServices.create(mockRace);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/races/create', mockRace);
		});
	});

	describe('find', function() {
		it('should call sendGET with success', function() {
			RaceServices.find(1);
			expect(mockRestAPIHelper.sendGET).toHaveBeenCalledWith('/api/races/find/page/1');
		});
	});

	describe('update', function() {
		it('should call sendPUT with success', function() {
			RaceServices.update('12345', mockRace);
			expect(mockRestAPIHelper.sendPUT).toHaveBeenCalledWith('/api/races/12345/update', mockRace);
		});
	});

	describe('delete', function() {
		it('should call sendDELETE with success', function() {
			RaceServices.delete('12345');
			expect(mockRestAPIHelper.sendDELETE).toHaveBeenCalledWith('/api/races/12345/delete');
		});
	});

	describe('retrieve', function() {
		it('should call sendGET with success', function() {
			RaceServices.retrieve('12345');
			expect(mockRestAPIHelper.sendGET).toHaveBeenCalledWith('/api/races/12345');
		});
	});

	describe('publish', function() {
		it('should call sendPUT with success', function() {
			RaceServices.publish('12345', true);
			expect(mockRestAPIHelper.sendPUT).toHaveBeenCalledWith('/api/races/12345/publish/true', undefined);
		});
	});

	describe('search', function() {
		it('should call sendPOST with success', function() {
			var criteria = {
				fulltext: "dua"
			};
			RaceServices.search(criteria);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/races/search/', {
				"criteria": criteria
			});
		});
	});

	describe('findAll', function() {
		it('should call sendGET with success', function() {
			RaceServices.findAll();
			expect(mockRestAPIHelper.sendGET).toHaveBeenCalledWith('/api/races/');
		});
	});

	describe('suggest', function() {
		it('should call sendPOST with success', function() {
			var criteria = {
				fulltext: "dua"
			};
			RaceServices.suggest(criteria);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/races/autocomplete/', {
				"criteria": criteria
			});
		});
	});
});