angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('fr', {"button.cancel":"Annuler","field.actualPassword":"Mot de passe actuel"});
/* jshint +W100 */
}]);