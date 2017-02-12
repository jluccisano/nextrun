nextrunControllers.controller('LoginCtrl', ['$scope','$http', '$location', '$rootScope','Auth','Alert','$modal','$log',
	function($scope, $http, $location, $rootScope, Auth, Alert, $modal,$log) {

		$scope.signup = function() {
			$location.path('/signup');
		};

		$scope.submit = function() {

			Auth.login({
                _csrf: jQuery('#_csrf').val(),
				email: jQuery('#email').val(), 
				password: jQuery('#password').val()
            },
            function(res) {
				$location.path('/myraces');
		
            },
            function(error) {
            	Alert.add("danger", error.message[0], 3000);
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


		$scope.open = function () {

		    var modalInstance = $modal.open({
			      templateUrl: 'partials/forgotpassword',
			      controller: 'ModalInstanceCtrl'
			    });
  		};

		

}]);

nextrunControllers.controller('ModalInstanceCtrl', ['$scope','$modalInstance', 'Auth', 'Alert',
	function($scope, $modalInstance, Auth, Alert) {

		  $scope.user = {};

		  $scope.submit = function () {

		  	Auth.forgotpassword({
				user: $scope.user
            },
            function(res) {
            	Alert.add("success", "Un email vient de vous être envoyé", 3000);
            	$modalInstance.close();
				$location.path('/login');

            },
            function(error) {
            	Alert.add("danger", error.message, 3000);
            	$modalInstance.close();
            });

		    
		  };

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
  	}
]);