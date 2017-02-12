 "use strict";
 
angular.module("nextrunApp.commons").factory("XmlService", function() {
	var x2js = new X2JS();
	return {
		xml2json: x2js.xml_str2json
	};
});