angular.module("nextrurApp.race").value("dateRanges", function(gettextCatalog) {
	return [{
		label: gettextCatalog.getString("Les 7 Prochains jours"),
		startDate: moment(),
		endDate: moment().add("days", 6)
	}, {
		label: gettextCatalog.getString("Les 30 Prochains jours"),
		startDate: moment(),
		endDate: moment().add("days", 29)
	}, {
		label: gettextCatalog.getString("Les 3 mois à venir"),
		startDate: moment(),
		endDate: moment().add("days", 89)
	}, {
		label: gettextCatalog.getString("Les 6 mois à venir"),
		startDate: moment(),
		endDate: moment().add("days", 179)
	}, {
		label: gettextCatalog.getString("Personnalisée"),
		startDate: moment(),
		endDate: undefined
	}]
});