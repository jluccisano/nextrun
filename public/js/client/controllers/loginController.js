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

		$scope.items = ['item1', 'item2', 'item3'];

		$scope.open = function () {

		    var modalInstance = $modal.open({
			      templateUrl: 'partials/forgotpassword',
			      controller: 'ModalInstanceCtrl',
			      resolve: {
			        items: function () {
			          return $scope.items;
			        }
			      }
			    });

			    modalInstance.result.then(function (selectedItem) {
			      $scope.selected = selectedItem;
			    }, function () {
			      $log.info('Modal dismissed at: ' + new Date());
			    });
  		};

		

}]);

nextrunControllers.controller('ModalInstanceCtrl', ['$scope','$modalInstance', 'items',
	function($scope, $modalInstance, items) {

		  $scope.items = items;
		  $scope.selected = {
		    item: $scope.items[0]
		  };

		  $scope.ok = function () {
		    $modalInstance.close($scope.selected.item);
		  };

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
  	}
]);

/*
nextrunControllers.controller('ForgotPasswordCtrl', ['$scope','$location','Auth','Alert',
	function($scope, $location, Auth, Alert) {

		$scope.forgotPassword = function() {

			$scope.email =  {
					_csrf: jQuery('#_csrf').val(),
					email: jQuery('#forgotEmail').val() 
				};

			Auth.forgotpassword({
					_csrf: jQuery('#_csrf').val(),
					email: jQuery('#forgotEmail').val() 
            },
            function(res) {
            	Alert.add("info", "Un email vient de vous être envoyé", 3000);
				$location.path('/login');
            },
            function(error) {
            	Alert.add("danger", error.message[0], 3000);
            });
		};
		
		jQuery('#forgotPasswordForm').validate({
			submitHandler: function(form) {
				$scope.forgotPassword();
			},
			rules: {
				forgotEmail: {
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
		
	}
]);
*/