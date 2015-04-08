'use strict';
/* PlayerService Module */

promod.factory('PlayerService', ['$http', '$rootScope', '$resource', function($http, $rootScope, $resource) {

        var restPlayerService = $resource(
                $rootScope.apipath + ':url', {
                    url: '@url'
                }, {
            getAudioToBePlayed: {
                method: 'GET',
                url: $rootScope.apipath + "/v1/player"
            },
            setAudioToPlay: {
                method: 'POST',
                url: $rootScope.apipath + "/v1/player"
            }
        });

        return restPlayerService;

    }]);

