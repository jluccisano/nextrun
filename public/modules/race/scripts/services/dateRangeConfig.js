"use strict";

angular.module("nextrunApp.race").value("DateRangeConfig", {
	minDate: "01/01/2012",
	maxDate: "31/12/2015",
	dateLimit: {
		days: 365
	},
	showDropdowns: true,
	showWeekNumbers: true,
	timePicker: false,
	timePickerIncrement: 1,
	timePicker12Hour: true,
	ranges: {
		"Les 7 Prochains jours": [moment(), moment().add("days", 6)],
		"Les 30 Prochains jours": [moment(), moment().add("days", 29)],
		"Les 3 mois à venir": [moment(), moment().add("days", 89)],
		"Les 6 mois à venir": [moment(), moment().add("days", 179)]
	},
	opens: "left",
	buttonClasses: ["btn btn-default"],
	applyClass: "btn-small btn-primary",
	cancelClass: "btn-small",
	format: "DD/MM/YYYY",
	separator: " a ",
	locale: {
		applyLabel: "Valider",
		fromLabel: "de",
		toLabel: "a",
		customRangeLabel: "Personnalise",
		daysOfWeek: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
		monthNames: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"],
		firstDay: 0
	}
});