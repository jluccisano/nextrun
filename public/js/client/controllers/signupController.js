nextrunControllers.controller('SignupCtrl', ['$scope','$http', '$location', '$rootScope','Auth', 'Alert'
	function($scope, $http, $location, $rootScope, Auth, Alert) {

	$scope.user = {
			_csrf: jQuery('#_csrf').val(),
			username: jQuery('#username').val(), 
			email: jQuery('#email').val(), 
			password: jQuery('#password').val()
	};
						
	jQuery('#signupForm').validate({
		submitHandler: function(form) {

			Auth.register({
        		_csrf: jQuery('#_csrf').val(),
				username: jQuery('#username').val(), 
				email: jQuery('#email').val(), 
				password: jQuery('#password').val()
            },
            function() {
            	Alert.add("info", "Félicitation! votre inscription a été validé", 3000);
				$location.path('/');
            },
            function(error) {
                Alert.add("danger", error.message, 3000);
            });			
		},
		rules: {
			username : {
				required: true,
				minlength: 4
			},
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
			jQuery(element).closest('.form-group').addClass('has-error');
		},
		unhighlight: function(element) {
			jQuery(element).closest('.from-group').removeClass('has-error');
		},
		messages: {
			username: {
				required: jQuery.t("validator.required"),
				minlength: jQuery.t("validator.usernameMinLength")
			},
			email: {
				required: jQuery.t("validator.required"),
				email: jQuery.t("validator.email")
			},
			password: {
				required: jQuery.t("validator.required"),
				minlength: jQuery.t("validator.passwordMinLength")
			},
			confirmPassword: {
				required: jQuery.t("validator.required"),
				confirm_password: jQuery.t("validator.confirmPassword")
			}
		},
		errorElement: 'span',
		errorClass: 'help-block',
		errorPlacement: function(error, element) {
			if(element.parent('.input-group').length) {
				error.insertAfter(element.parent());
			} else {
				error.insertAfter(element);
			}
		}
	});
	
}]);