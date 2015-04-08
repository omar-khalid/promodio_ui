'use strict';
/* AudioService Module */

promod.factory('AudioService', ['$http', '$rootScope', '$resource', function ($http, $rootScope, $resource) {

        var restAudioService = $resource(
//                $rootScope.apipath + ':url', {
//                    url: '@url'
        $rootScope.apipath + '/v1/audio/:audio_id', {
            
                }, {
            getAudio: {
                method: 'GET',
                //url: $rootScope.apipath + "/v1/audio"
                params: {
                    audio_id: '@audio_id'
                }
            },
            getAudioByUser: {
                method: 'GET',
                url: $rootScope.apipath + "/v1/audio"
            },
            uploadAudio: {
                method: 'POST',
                url: $rootScope.apipath + "/v1/audio"
            },
            deleteAudio: {
                method: 'Delete',
                url: $rootScope.apipath + "/v1/audio"
            }
        });

        return restAudioService;

    }]);

