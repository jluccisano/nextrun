"use strict";

angular.module("nextrunApp.commons").factory("FacebookService",
    function() {
        
        return {
            getFB: function() {
                if(typeof FB === "undefined" && FB === null) {
                    throw new Error("FB is not instanced");
                }
                return FB;
            },
            parseXFBML: function(element) {
                try {
                    var FB = this.getFB();
                     FB.XFBML.parse(element);
                } catch(ex) {
                     throw new Error("No way to parse xfbml");
                }
            }
        };
    });