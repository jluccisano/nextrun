"use strict";

angular.module("nextrunApp.race").factory("RichTextEditorService",
    function($modal) {
        return {
            openRichTextEditorModal: function(content) {
                var modalInstance = $modal.open({
                    templateUrl: "partials/race/richTextEditorModal",
                    controller: "RichTextEditorModalController",
                    size: "lg",
                    resolve: {
                        content: function() {
                            return content;
                        }
                    }
                });
                return modalInstance;
            }
        };
    });