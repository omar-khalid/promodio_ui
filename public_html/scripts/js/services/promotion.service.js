'use strict';
/* PromotionService Module */

promod.factory('PromotionService', ['$http', '$rootScope', '$resource', function($http, $rootScope, $resource) {

        var restPromotionService = $resource(
                $rootScope.apipath + ':url', {
                    url: '@url'
                }, {
            getPromotion: {
                method: 'GET',
                url: $rootScope.apipath + "/v1/promotion"
            },
            promoteAudio: {
                method: 'POST',
                url: $rootScope.apipath + "/v1/promotion"
            },
            deletePromotion: {
                method: 'Delete',
                url: $rootScope.apipath + "/v1/promotion"
            }
        });

        return restPromotionService;

    }]);

