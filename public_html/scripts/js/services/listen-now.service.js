'use strict';
/* ListenNowService Module */

promod.factory('ListenNowService', ['$http', '$rootScope', '$resource', function($http, $rootScope, $resource) {

        var restListenNowService = $resource(
                $rootScope.apipath + ':url', {
                    url: '@url'
                }, {
            getCurrentSong: {
                method: 'GET',
                url: $rootScope.apipath + "/v1/listen_now"
            },
            getNextSong: {
                method: 'POST',
                url: $rootScope.apipath + "/v1/listen_now"
            },
            updateCurrentSong: {
                method: 'PUT',
                url: $rootScope.apipath + "/v1/listen_now"
            },
            payCurrentSongCredits: {
                method: 'PUT',
                url: $rootScope.apipath + "/v1/listen_now"
            }
        });

        return restListenNowService;

    }]);

