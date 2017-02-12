jQuery(document).ready(function(){

	loadMapFrance();

	jQuery('#carousel').carousel();
	
	/*
	jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
		return arg !== value;
	}, "");

	jQuery('#leanForm').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			type: {
				valueNotEquals: "default"
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
				required: "Entrez votre email et sélectionnez un élément",
				email: "Entrez votre email et sélectionnez un élément"
			},
			type: {
				valueNotEquals: "Entrez votre email et sélectionnez un élément",
			}
		},
		groups: {
			error: "email type"
		},
		errorLabelContainer: "#nameError",
		errorPlacement: function(error, element) {
			if (element.attr("name") === "email" || element.attr("name") === "type" ) {
				error.appendTo("#nameError");
			} else {
				error.insertAfter(element);
			}
		}
	});

*/

	jQuery("#contactType").change(function () {
		if(jQuery(this).val() === "default") {
			jQuery(this).addClass("empty");
		} else {
			jQuery(this).removeClass("empty");
		} 
	});

	jQuery("#contactType").change();

});