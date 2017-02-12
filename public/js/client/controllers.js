var nextrunControllers = angular.module('nextrunControllers', []);


nextrunControllers.controller('HomeCtrl', ['$scope','$http',
	function($scope, $http) {
	
}]);

nextrunControllers.controller('LoginCtrl', ['$scope','$http', '$location',
	function($scope, $http, $location) {

		$scope.signup = function() {
			$location.path('/signup');
		};

		jQuery('#loginForm').validate({
			submitHandler: function(form) {

				var data = {_csrf: jQuery('#_csrf').val(),
							email: jQuery('#email').val(), 
							password: jQuery('#password').val()};

				jQuery.ajax({
					type: "POST",
					url: "/users/session",
					data: data,
					dataType: 'json'
				}).done(function(data) {
					
					if (data.success == 'OK') {
						window.location.href="/#/users/races/home";
					} else {

						jQuery('#invalidEmailOrPassword').addClass('in').removeClass('hide');
						var error = data.error;
						if(error) {
							jQuery('#invalidEmailOrPassword').text(error);
						}
					}
				});
			},
			rules: {
				email: {
					required: true,
					email: true
				},
				password : {
					required: true,
					minlength: 4
				}
			},
			highlight: function(element) {
				jQuery(element).closest('.control-group').addClass('has-error');
			},
			unhighlight: function(element) {
				jQuery(element).closest('.control-group').removeClass('has-error');
			},
			messages: {
				email: {
					required: "Veuillez saisir une adresse email valide",
					email: "Veuillez saisir une adresse email valide"
				},
				password: {
					required: "Veuillez saisir un mot de passe",
					minlength: "Le mot de passe doit contenir au moins 4 caractères"
				}
			}
		});
		 
	
}]);

nextrunControllers.controller('SignupCtrl', ['$scope','$http', '$location',
	function($scope, $http, $location) {

		
	jQuery('#signupForm').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password : {
				required: true,
				minlength: 4
			},
			confirmPassword : {
				required: true,
				minlength: 4,
				equalTo: "#password"
			}
		},
		highlight: function(element) {
			jQuery(element).closest('.control-group').addClass('has-error');
		},
		unhighlight: function(element) {
			jQuery(element).closest('.control-group').removeClass('has-error');
		},
		messages: {
			email: {
				required: "Veuillez saisir une adresse email valide",
				email: "Veuillez saisir une adresse email valide"
			},
			password: {
				required: "Veuillez saisir un mot de passe",
				minlength: "Le mot de passe doit contenir au moins 4 caractères"
			},
			confirmPassword: {
				required: "Veuillez confirmer votre mot de passe",
				confirm_password: "Le mot de passe est différent"
			}
		}
	});
		 
	
}]);

nextrunControllers.controller('FooterCtrl', ['$scope','$location','$timeout',
	function($scope, $location, $timeout) {

		$scope.hideFooter = false;

		$scope.$on( '$routeChangeSuccess', function ( event, current, previous ) {
			if ( $location.path() === '/' ) {

				$timeout(function() {
					$scope.hideFooter = true;
				}, 1000);

			} else {
				$scope.hideFooter = false;
			}
		});
	}
]);



