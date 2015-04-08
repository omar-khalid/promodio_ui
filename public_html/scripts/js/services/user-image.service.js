'use strict';
/* UserImageService Module */

promod.factory('UserImageService', ['$http', '$rootScope', '$resource', function($http, $rootScope, $resource) {

        var restUserImageService = $resource(
                $rootScope.apipath + ':url', {
                    url: '@url'
                }, {
            getImage: {
                method: 'GET',
                url: $rootScope.apipath + "/v1/image"
            },
            getProfileImage: {
                method: 'GET',
                url: $rootScope.apipath + "/v1/image?image_type=profile"
            },
            getCoverImage: {
                method: 'GET',
                url: $rootScope.apipath + "/v1/image?image_type=cover"
            }
        });

        return restUserImageService;

    }]);

