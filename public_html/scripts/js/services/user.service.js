'use strict';
/* UserService Module */

promod.factory('UserService', ['$http', '$rootScope', '$resource', function($http, $rootScope, $resource) {

        var restUserService = $resource(
                $rootScope.apipath + ':url', {
                    url: '@url'
                }, {
            getUser: {
                method: 'GET',
                url: $rootScope.apipath + "/v1/user"
            },
            registerUser: {
                method: 'POST',
                url: $rootScope.apipath + "/v1/user"
            },
            updateUser: {
                method: 'PUT',
                url: $rootScope.apipath + "/v1/user"
            }
        });

        return restUserService;

    }]);

