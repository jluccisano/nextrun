var phantom = require('node-phantom'),
	ph;

phantom.create(function(phantomPh) {
	ph = phantomPh;
});


module.exports = function(req, res, next) {

	var ua;
	res.locals.viewContent = null;
	ua = req.headers['user-agent'];
	if (!ua.match(/bot/i)) {
		return next();
	}
	ph.createPage(function(page) {
		page.set('onConsoleMessage', function(msg) { // Détection des événements console
			var data;
			try {
				data = JSON.parse(msg);
			} catch (err) {}
			if (data && data.mainContent) { // Récupération du contenu provenant de PhantomJS et injection dans le template
				res.locals.viewContent = data.mainContent;
				page.close();
				next();
			} else {
				console.log('log from phantom :', msg); // Trace normale
			}
		});
		page.open('http://localhost:3000' + req.path, function(status) {
			page.evaluate(function() { // Evaluation de la page par PhantomJS, ici on est dans un contexte client
				var mainElt, mainContent;
				mainElt = document.getElementById('main');
				mainContent = mainElt && mainElt.innerHTML; // On récupère le contenu qui nous intéresse
				mainContent = mainContent || '';
				console.log(JSON.stringify({
					mainContent: mainContent
				})); // On envoie le contenu au serveur
			});
		});
	});
};