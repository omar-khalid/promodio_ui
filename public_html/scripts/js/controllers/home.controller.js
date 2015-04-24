'use strict';
/* Controller Module */

promodControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$timeout', '$location', 'AudioService', 'PromotionService', 'ListenNowService', 'PlayerService', 'UserService', 'UserImageService', function($scope, $rootScope, $http, $timeout, $location, AudioService, PromotionService, ListenNowService, PlayerService, UserService, UserImageService) {

        $scope.$on('$viewContentLoaded', function() {            
            $scope.currentTracks = $rootScope.TRACK_LOAD_LIMIT;            
            $scope.retrievePromotedAudios();//try to retrieve all Audios uploaded by current user. If no audio is uploaded then will fetch all promoted audio list on home page
        });
        
        $rootScope.currentPage = 'home';
        $rootScope.clearAlertMessages();
        $scope.section = 1;
        $scope.responseCompleted=true;        
        $scope.currentTracks = 8;        
        $scope.totalTracks = 0;
        $rootScope.tracks = [];
        $rootScope.tracksIds = [];
        //$rootScope.tracksIds = [];                
        $scope.tracksAvailableToLoad=false;
        $scope.tracksLoadStatus=0;//0-initial, 1-processing,2-success,3-failure
        $scope.trackInitializationStatus=0;
        
        /**Dynamic Support to Load Audio Tracks***/
        $scope.loadMoreTracks = function() {
            $scope.currentTracks = $scope.currentTracks + $rootScope.TRACK_LOAD_LIMIT;
            if ($scope.currentTracks > $scope.totalTracks) {
                $scope.currentTracks = $scope.totalTracks;
            }
            if($scope.tracksLoadStatus!==1)
                $scope.loadTracks();
        };
        
        $scope.removeMyPromotion = function (track,index) {
            $rootScope.demoteTrack = track;
            $rootScope.demoteResult = false;
            $rootScope.requestingPage = 'home';
            $rootScope.demotedTrackIndex = index;
            $scope.loadDemoterInfo(track.ownerId);
            $rootScope.openDemoteTrackModal();
        };
        
        $scope.addMyPromotion = function (track) {
            $rootScope.backupPlayerPromoteTrack();
            $rootScope.isDirectPromotion = true;
            $rootScope.promoteTrack = track;
            $rootScope.promoteResult = false;
            $scope.loadPromoterInfo(track.ownerId,false);
            $rootScope.openPromoteTrackModal();
        };
        
        $scope.loadTracks=function(){  
            
            var startIndex = $rootScope.tracks.length;
            var endIndex = startIndex + $rootScope.TRACK_LOAD_LIMIT-1;
            
            if(endIndex>=$rootScope.tracksIds.length)
                endIndex=$rootScope.tracksIds.length-1;                        
            if(startIndex>endIndex)
                return;                          
            $scope.totalTracksToLoad=endIndex-startIndex+1;
            $scope.tracksLoaded=0;
            $scope.tracksLoadStatus=1;//processing status
            for(var i=startIndex;i<=endIndex;i++) {                
                $scope.loadTrackByAudioID($rootScope.tracksIds[i]);
            };            
        };        
        
        $scope.retrievePromotedAudios = function() {
            $scope.trackInitializationStatus=1;
            var success = function(data) {                
                if (data.promotions !== undefined) {
                    
                    angular.forEach(data.promotions, function(promotion) {                        
                        if ($scope.audioExists(promotion.audio_id)) {
                            //audio already added no need to add                                                                                   
                        } else {
                            if($rootScope.currentPage === 'home')
                                $rootScope.tracksIds.push(promotion.audio_id);                              
                        }                       
                    });
                    $scope.totalTracks = $rootScope.tracksIds.length;                    
                    if($scope.totalTracks>0)                                                
                        $scope.loadTracks();
                    //else
                        //$scope.retrieveUploadedAudios();//retrieve all of your uploaded audio
                } else {
                    var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
                $scope.trackInitializationStatus=2;
            };

            var failure = function() {                
                var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
                $scope.trackInitializationStatus=2;
            };

            PromotionService.getPromotion(success, failure);
        };
        
        $scope.retrieveUploadedAudios = function() {

            var success = function(data) {

                if (data.audios !== undefined) {

                    $scope.audios = data.audios;                                       

                    angular.forEach($scope.audios, function(audio) {
                        if ($scope.audioExists(audio.id)) {
                            //audio already added no need to add                            
                        } else {
                            if($rootScope.currentPage === 'home')
                                $rootScope.tracksIds.push(audio.id);                            
                        }
                    }); 
                    
                    

                } else {
                    var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };

            var failure = function() {

                var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            };

            AudioService.getAudio(success, failure);
        };
        
        $scope.loadTrackByAudioID=function(audioId){
            
            var i = 0;            
            var totalPromoters;
            var promoters = [];
            var promoterId;
            var audioData = {};
            var isMyPromotion=false;

            var failure = function() {

                var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            };

            var successUser = function(data) {

                var user = {};

                if (data.user_images!==undefined && data.user_images!==null && data.user_images.length > 0) {
                    user.imageURL = $rootScope.apipath + data.user_images[data.user_images.length-1].image_url;
                    user.id = data.user_images[data.user_images.length-1].user_id;
                } else {
                    user.imageURL = "";
                    user.id = promoterId;
                }
//                
//                if(!$scope.promoterExists(user.id)){                    
//                    $scope.promotersIds.push(user.id);
//                    $scope.promoters.push(user);
//                }
                
                promoters.push(user);
                i = i + 1;

                if (parseInt(totalPromoters) === parseInt(i)) {
                    setIconImage();
                }

            };

            var setIconImage = function() {
                UserImageService.getImage({image_type: 'icon', user_id: audioData.ownerId}, {}, successIconImage, failure);
            };
            
            var successIconImage=function(data){
                if (data.user_images!==undefined && data.user_images!==null && data.user_images.length > 0) {
                    audioData.iconURL = $rootScope.apipath + data.user_images[data.user_images.length-1].image_url;
                } else {
                    audioData.iconURL = "";
                }
                setTrack();
            };

            var setTrack = function() {
                UserImageService.getImage({image_type: 'profile', user_id: audioData.ownerId}, {}, successUserImage, failure);
            };

            var successUserImage = function(data) {

                audioData.promoters = promoters;
                audioData.isMyPromotion = isMyPromotion;

                if (data.user_images!==undefined && data.user_images!==null && data.user_images.length > 0) {
                    audioData.imageURL = $rootScope.apipath + data.user_images[data.user_images.length-1].image_url;
                } else {
                    audioData.imageURL = "";
                }
                if($rootScope.currentPage === 'home')
                    $rootScope.tracks.push(audioData);    
                $scope.tracksLoaded = $scope.tracksLoaded+1;
                $scope.responseCompleted = true;
                
                if($scope.totalTracksToLoad===$scope.tracksLoaded)
                {                       
                    $scope.tracksLoadStatus=2;//success(complete processing) status
                    if($rootScope.tracks.length<$rootScope.tracksIds.length)
                        $scope.tracksAvailableToLoad=true;
                    else
                        $scope.tracksAvailableToLoad=false;                    
                }
            };
            
            var successPromoters = function(data) {
                isMyPromotion=false;
                if (data.promotions !== undefined) {

                    $scope.promotions = data.promotions;
                    totalPromoters = $scope.promotions.length;                    
                    
                    if (totalPromoters > 0) {
                        angular.forEach($scope.promotions, function(promotion) {

                            promoterId = promotion.promoter_id;
                            if($rootScope.isCurrentUserId(promoterId)){
                                isMyPromotion=true;
                            }
                            UserImageService.getImage({image_type: 'profile', user_id: promotion.promoter_id}, {}, successUser, failure);
                        });
                    } else {
                        setIconImage();
                    }

                } else {
                    var msg = $rootScope.RETRIEVE_PROMOTERS_FAILED;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };
            
            var setPromoters = function() {
                PromotionService.getPromotion({audio_id: audioId}, {}, successPromoters, failure);
            };
           
            var successAudioData = function(data) {

                if(data.audio!==undefined){
                    
                    audioData.id = data.audio.id;
                    audioData.title = data.audio.title;
                    audioData.date = data.audio.date_added;
                    audioData.ownerId = data.audio.owner_id;
                    audioData.length = parseInt((parseFloat(data.audio.length) / 1000));                    
                    setPromoters();
                }else{
                    var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };
            
            AudioService.getAudio({audio_id:audioId},successAudioData,failure);
            
        };
        
        $scope.audioExists = function(audioId) {
            if (audioId === undefined || audioId === '')
                return false;
            return $rootScope.tracksIds.indexOf(audioId) > -1;
        };
        
        
        /**Dynamic Support to Load Audio Tracks End***/
        
        $scope.loadPromoterInfo=function(promoterId,isPlayingTrackInfo){
             
            $rootScope.promoterInfo={};
            var success = function(data) {
                
                if (data.user !== undefined) {
                    $rootScope.promoterInfo=data.user;
                    if(isPlayingTrackInfo){
                        $rootScope.backupPromoteTrack(null,$rootScope.promoterInfo);//(promoteTrack,promoterInfo)
                        $rootScope.updateCurrentPlayingTrack(null,$rootScope.promoterInfo);//(track,ownerInfo)
                    }
                    
                }else{
                    $rootScope.promoterInfo={};
                }
           };
           var failure = function(data) {
               $rootScope.promoterInfo={};                   
            };
            
            UserService.getUser({id: promoterId}, {}, success, failure);
         };
         
         $scope.loadDemoterInfo=function(promoterId){
             
             $rootScope.demoterInfo={};
           var success = function(data) {
                
                if (data.user !== undefined) {
                    $rootScope.demoterInfo=data.user;
                }else{
                    $rootScope.demoterInfo={};
                }
           };
           var failure = function(data) {
               $rootScope.demoterInfo={};                   
            };
            
            UserService.getUser({id: promoterId}, {}, success, failure);
         }; 
         
        $scope.playNow = function(track) {
            
            $rootScope.shouldPlayNextTrack = false;
            $rootScope.listeningSongCreditDetails={};
            $rootScope.promoteTrack = track;
            $rootScope.promoteResult = false;
            $rootScope.backupPromoteTrack(track,{});//(promoteTrack,promoterInfo)
            $scope.loadPromoterInfo(track.ownerId,true);
            if($rootScope.mediaPlayer.playing)
                $rootScope.mediaPlayer.pause();
            $rootScope.currentTrack= track;
            $rootScope.updateCurrentPlayingTrack(track,{});//(track,ownerInfo)
            var success = function(data) {

                $scope.currentAudioURL = $rootScope.apipath + data.audio_url;

                $rootScope.audioPlaylist = [];
                $rootScope.audioPlaylist.push({src: $scope.currentAudioURL, type: 'audio/mpeg', artist: track.album, title: track.title});

                $timeout(function() {
                    $rootScope.mediaPlayer.play();
                }, 10);
            };

            var failure = function() {
            };

            PlayerService.setAudioToPlay({'audio_id': track.id}, {}, success, failure);
        };
    }
]);
