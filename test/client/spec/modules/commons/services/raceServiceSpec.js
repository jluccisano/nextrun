describe('RaceService', function() {

	var $httpBackend, RaceService, mockRace, mockRestAPIHelper;

	beforeEach(module('nextrunApp.commons', function($provide) {
		mockRestAPIHelper = jasmine.createSpyObj('RestAPIHelper', ['sendPOST', 'sendGET', 'sendDELETE', 'sendPUT']);
		$provide.value('RestAPIHelper', mockRestAPIHelper);
	}));

	beforeEach(inject(function(_RaceService_) {
		RaceService = _RaceService_;

		mockRace = {
			name: "Duathlon de Castelnaudary"
		}
	}));

	describe('create', function() {
		it('should call sendPOST with success', function() {
			RaceService.create(mockRace);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/races/create', mockRace);
		});
	});

	describe('find', function() {
		it('should call sendGET with success', function() {
			RaceService.find(1);
			expect(mockRestAPIHelper.sendGET).toHaveBeenCalledWith('/api/races/find/page/1');
		});
	});

	describe('update', function() {
		it('should call sendPUT with success', function() {
			RaceService.update('12345', mockRace);
			expect(mockRestAPIHelper.sendPUT).toHaveBeenCalledWith('/api/races/12345/update', mockRace);
		});
	});

	describe('delete', function() {
		it('should call sendDELETE with success', function() {
			RaceService.delete('12345');
			expect(mockRestAPIHelper.sendDELETE).toHaveBeenCalledWith('/api/races/12345/delete');
		});
	});

	describe('retrieve', function() {
		it('should call sendGET with success', function() {
			RaceService.retrieve('12345');
			expect(mockRestAPIHelper.sendGET).toHaveBeenCalledWith('/api/races/12345');
		});
	});

	describe('publish', function() {
		it('should call sendPUT with success', function() {
			RaceService.publish('12345', true);
			expect(mockRestAPIHelper.sendPUT).toHaveBeenCalledWith('/api/races/12345/publish/true', undefined);
		});
	});

	describe('search', function() {
		it('should call sendPOST with success', function() {
			var criteria = {
				fulltext: "dua"
			};
			RaceService.search(criteria);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/races/search/', {
				"criteria": criteria
			});
		});
	});

	describe('findAll', function() {
		it('should call sendGET with success', function() {
			RaceService.findAll();
			expect(mockRestAPIHelper.sendGET).toHaveBeenCalledWith('/api/races/');
		});
	});

	describe('suggest', function() {
		it('should call sendPOST with success', function() {
			var criteria = {
				fulltext: "dua"
			};
			RaceService.suggest(criteria);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/races/autocomplete/', {
				"criteria": criteria
			});
		});
	});
});