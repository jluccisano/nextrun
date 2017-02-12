nextrunControllers.controller('SignupCtrl', ['$scope','$http', '$location',
	function($scope, $http, $location) {

	$scope.user = {
			_csrf: jQuery('#_csrf').val(),
			username: jQuery('#username').val(), 
			email: jQuery('#email').val(), 
			password: jQuery('#password').val()};
						
	jQuery('#signupForm').validate({
		submitHandler: function(form) {

			$scope.user = {
						_csrf: jQuery('#_csrf').val(),
						username: jQuery('#username').val(), 
						email: jQuery('#email').val(), 
						password: jQuery('#password').val()};

			jQuery.ajax({
				type: "POST",
				url: "/users",
				data: $scope.user,
				dataType: 'json'
			}).done(function(data) {
				
				if (data.response === 'success') {
					window.location.href="/#/users/races/home";
				} else {

					jQuery('.errors').addClass('in').removeClass('hide');
					var error = jQuery.t(data.response.errors.email.message);
					if(error) {
						jQuery('.errors').text(error);
					}
				}
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