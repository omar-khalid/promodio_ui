'use strict';
/* Directives Module */

var promodDirectives = angular.module('promod.directives', []);

promodDirectives.directive('header', function($timeout) {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
        templateUrl: "views/common/header.html",
        controller: ['$scope', '$rootScope', '$filter', function($scope, $rootScope, $filter) {
                // Your behaviour goes here :)
            }]
    }
});

promodDirectives.directive('footer', function($timeout) {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
        templateUrl: "views/common/footer.html",
        controller: ['$scope', '$rootScope', '$filter', function($scope, $rootScope, $filter) {
                // Your behaviour goes here :)
            }]
    }
});


promodDirectives.directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

promodDirectives.directive('agAlert', ['$compile', function($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, element, attrs) {

                var entity = attrs.entity;
                //alert message template
                var template =
                        '<div class="row">&nbsp;</div>' +
                        '<div ng-repeat="alert in validations"  style="cursor: pointer">' +
                        '<a class="list-group-item"  style="cursor: pointer;text-decoration: none" ng-class="alert.type" close="closeAlertMessage($index)">' +
                        '<div class="list-group-item-text text-success" ng-show="alert.type == \'alert-success\'"><span class="glyphicon  glyphicon-ok-circle pull-left" title="Success">&nbsp;</span> {{alert.msg}}<span class="glyphicon  glyphicon-remove pull-right" title="Cancel" ng-click="closeAlertMessage($index)"></span></div>' +
                        '<div class="list-group-item-text text-danger" ng-show="alert.type == \'alert-danger\'"><span class="glyphicon  glyphicon-remove-circle pull-left" title="Failure">&nbsp;</span> {{alert.msg}}<span class="glyphicon  glyphicon-remove pull-right" title="Cancel" ng-click="closeAlertMessage($index)"></span></div>' +
                        '<div class="list-group-item-text text-warning" ng-show="alert.type == \'alert-warning\'"><span class="glyphicon  glyphicon-warning-sign pull-left" title="Warning">&nbsp;</span> {{alert.msg}}<span class="glyphicon  glyphicon-remove pull-right" title="Cancel" ng-click="closeAlertMessage($index)"></span></div>' +
                        '</div>' +
                        '</a>' +
                        '<div class="row" ng-show="validations.length !== 0">&nbsp;</div>';
                //Rendering template.
                element.html('').append($compile(template)(scope));
            }
        };
    }]);

promodDirectives.directive('jqueryDatepicker', ['$parse', function(parse) {

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {

                var year = "1910:" + new Date(scope.serverDate).getFullYear();
                var maxDate = new Date(scope.serverDate);
                var minDate = "";

                if (attrs.mindate) {
                    year = new Date(scope.serverDate).getFullYear() + ":" + (new Date(scope.serverDate).getFullYear() + 10);
                    var maxDate = "";
                    var minDate = new Date(scope.serverDate);
                }

                setTimeout(function() {
                    $(function() {
                        element.datepicker({
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: 'M d, yy',//'dd.mm.yy',
                            maxDate: maxDate,
                            minDate: minDate,
                            yearRange: year,
                            onSelect: function(date) {
                                scope.$apply(function() {
                                    ngModelCtrl.$setViewValue(date);
                                });
                            }
                        });
                    });
                }, 100);

            }
        }

    }]);