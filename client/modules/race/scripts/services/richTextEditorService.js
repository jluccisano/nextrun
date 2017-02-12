"use strict";

angular.module("nextrunApp.race").factory("RichTextEditorService",
    function($modal) {
        return {
            openRichTextEditorModal: function(model) {
                var modalInstance = $modal.open({
                    templateUrl: "partials/race/richTextEditorModal",
                    controller: "RichTextEditorModalController",
                    size: "lg",
                    resolve: {
                        model: function() {
                            return model;
                        }
                    }
                });
                return modalInstance;
            }
        };
    });