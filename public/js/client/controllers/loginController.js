nextrunControllers.controller('LoginCtrl', ['$scope','$http', '$location',
	function($scope, $http, $location) {

		$scope.user = {
							_csrf: jQuery('#_csrf').val(),
							email: jQuery('#email').val(), 
							password: jQuery('#password').val()
						};

		$scope.signup = function() {
			$location.path('/signup');
		};

		$scope.submit = function() {

			$scope.user =  {
					_csrf: jQuery('#_csrf').val(),
					email: jQuery('#email').val(), 
					password: jQuery('#password').val()
			};

			jQuery.ajax({
				type: "POST",
				url: "/users/session",
				data: $scope.user,
				dataType: 'json'
			}).done(function(data) {
				
				if (data.response === 'success') {
					$location.path('/myraces');
				} else {

					jQuery('.errors').addClass('in').removeClass('hide');
					var error = jQuery.t(data.response.message);
					if(error) {
						jQuery('.errors').text(error);
					}
				}
			});
		};

		$scope.forgotPassword = function() {

			$scope.email =  {
					_csrf: jQuery('#_csrf').val(),
					email: jQuery('#forgotEmail').val() 
				};

			jQuery.ajax({
				type: "POST",
				url: "/users/forgotpassword",
				data: $scope.email,
				dataType: 'json'
			}).done(function(data) {
				if (data.response === 'success') {

					jQuery('#forgotPasswordModal').modal('hide');

					$location.path('/login');
				} else {

					jQuery('.errors').addClass('in').removeClass('hide');
					var error = jQuery.t(data.response);
					if(error) {
						jQuery('.errors').text(error);
					}
				}
			});
		};

		jQuery('#loginForm').validate({
			submitHandler: function(form) {
				$scope.submit();
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
				jQuery(element).closest('.form-group').addClass('has-error');
			},
			unhighlight: function(element) {
				jQuery(element).closest('.form-group').removeClass('has-error');
			},
			messages: {
				email: {
					required: jQuery.t("validator.required"),
					email: jQuery.t("validator.email")
				},
				password: {
					required: jQuery.t("validator.required"),
					minlength: jQuery.t("validator.passwordLength")
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

		jQuery('#forgotPasswordForm').validate({
			submitHandler: function(form) {
				$scope.forgotPassword();
			},
			rules: {
				email: {
					required: true,
					email: true
				}
			},
			highlight: function(element) {
				jQuery(element).closest('.from-group').addClass('has-error');
			},
			unhighlight: function(element) {
				jQuery(element).closest('.form-group').removeClass('has-error');
			},
			messages: {
				forgotEmail: {
					required: jQuery.t("validator.required"),
					email: jQuery.t("validator.email")
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