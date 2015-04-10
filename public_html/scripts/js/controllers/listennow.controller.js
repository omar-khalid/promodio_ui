'use strict';
/* Controller Module */

promodControllers.controller('ListennowController', ['$scope', '$interval', '$rootScope', '$http', '$timeout', '$location', 'AudioService', 'PromotionService', 'ListenNowService', 'PlayerService', 'UserService', 'UserImageService', function($scope, $interval, $rootScope, $http, $timeout, $location, AudioService, PromotionService, ListenNowService, PlayerService, UserService, UserImageService) {

        $scope.$on('$viewContentLoaded', function() {
            //$scope.listenCurrentSong();
            $scope.initializeNextSong();
        });
        
        $rootScope.clearAlertMessages();
        $scope.currentTrack = {title: '  '};
        $rootScope.currentTrack={};
        $rootScope.shouldPlayNextTrack = false;
        $scope.trackLoaded = false;
        $scope.trackLoadStatus = 0;//0 - initial, 1 - processing, 2 - success, 3 - failure
        $scope.playingTrack = false;
        $rootScope.isDirectPromotion=false;
        $scope.isDirectPlay = false;
        $scope.playCurrentTrack = function() {
            $rootScope.audioPlaylist = [];
            $rootScope.audioPlaylist.push({src: $scope.currentTrack.audioUrl, type: 'audio/mpeg', artist: $scope.currentTrack.album, title: $scope.currentTrack.title});

            $timeout(function() {
                $rootScope.mediaPlayer.play();
            }, 10);
            $rootScope.approveListeningSongCredits();
            $scope.playingTrack = true;
            $rootScope.promoteTrack = $scope.currentTrack;
            $rootScope.promoteResult = false;
            $rootScope.promoterInfo = $scope.currentTrack.ownerInfo;
            $rootScope.backupPromoteTrack($scope.currentTrack,$scope.currentTrack.ownerInfo);//(promoteTrack,promoterInfo)
            $rootScope.updateCurrentPlayingTrack($scope.currentTrack,$scope.currentTrack.ownerInfo);//(track,ownerInfo)
        };


 /*       $rootScope.listeningSongCreditDetails = {songId: '', creditAvailable: false, playedDuration: 0, creditApproved: false};

        $rootScope.setListeningSongCreditDetails = function(songId, creditAvailable, playedDuration, creditApproved) {
            if (songId !== null)
                $rootScope.listeningSongCreditDetails.songId = songId;
            if (creditAvailable !== null)
                $rootScope.listeningSongCreditDetails.creditAvailable = creditAvailable;
            if (playedDuration !== null)
                $rootScope.listeningSongCreditDetails.playedDuration = playedDuration;
            if (creditApproved !== null)
                $rootScope.listeningSongCreditDetails.creditApproved = creditApproved;
        };

        $rootScope.resetListeningSongCreditDetails = function() {
            $rootScope.listeningSongCreditDetails = {songId: '', creditAvailable: false, playedDuration: 0, creditApproved: false};
        };

        $rootScope.removeListeningSongCredit = function() {
            $rootScope.listeningSongCreditDetails.creditAvailable = false;
        };

        $rootScope.approveListeningSongCredits = function() {

            if ($rootScope.listeningSongCreditDetails.creditApproved !== true) {
                $rootScope.listeningSongCreditDetails.creditApproved = true;
                $rootScope.startTimerToPayCredits();
            }
        };
        $rootScope.clearLastSongCreditDetails = function() {
            //$rootScope.listeningSongCreditDetails={};
            $rootScope.watchCreditRemoval();
        };

        $rootScope.startTimerToPayCredits = function() {
            if ($rootScope.watchCreditRemoval !== undefined)
                $rootScope.watchCreditRemoval();

            $rootScope.watchCreditRemoval = $rootScope.$watch(function() {
                if ($rootScope.mediaPlayer !== undefined)
                    return $rootScope.mediaPlayer.currentTime;
            }, function(newVal, oldVal) {

                if (newVal !== undefined && oldVal !== undefined) {
                    var oldTime = Math.round(oldVal);
                    var newTime = Math.round(newVal);
                    if ($rootScope.listeningSongCreditDetails.creditAvailable && $rootScope.listeningSongCreditDetails.creditApproved && $rootScope.mediaPlayer.playing && newTime > oldTime && $rootScope.listeningSongCreditDetails.songId === $rootScope.currentPlayingTrack.track.id) {
                        console.log("playedDuration " + $scope.listeningSongCreditDetails.playedDuration);
                        $rootScope.listeningSongCreditDetails.playedDuration++;
                        if ($rootScope.listeningSongCreditDetails.playedDuration > $rootScope.CONSTANTS.SONG_CREDIT_DURATION) {
                            console.log("5 points credited to this song");
                            $rootScope.payCreditsToSong($rootScope.listeningSongCreditDetails.songId);//call method to credit points to listeningSongCreditDetails.songId
                            $rootScope.removeListeningSongCredit();//no more credits for this song
                        }
                    }
                }

            });
        };

        $rootScope.payCreditsToSong = function(songId) {

            if (songId !== '' && songId !== undefined) {

                var success = function(data) {
//                    alert($rootScope.MESSAGES.SONG_LISTENING_CREDIT_PAYMENT_SUCCESS);
//                    var msg = $rootScope.MESSAGES.SONG_LISTENING_CREDIT_PAYMENT_SUCCESS;
//                    var type = $rootScope.failure;
//                    $rootScope.addMessage(msg, type);
                      $rootScope.updateCredits();
                };

                var failure = function(response) {
                    console.log(response);
                    //alert($rootScope.MESSAGES.SONG_LISTENING_CREDIT_PAYMENT_FAILURE + "\nServer responded with " + response.status + " " + response.statusText);
                    var alertMsg = $rootScope.MESSAGES.SONG_LISTENING_CREDIT_PAYMENT_FAILURE + "\nServer responded with " + response.status + " " + response.statusText;
                    $rootScope.showAlertMessage(alertMsg);
                    var msg = $rootScope.MESSAGES.SONG_LISTENING_CREDIT_PAYMENT_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                };

                var id = {
                    id: $rootScope.listenNowId
                };
                ListenNowService.payCurrentSongCredits(id, {}, success, failure);
            }
        };

        $rootScope.listenNowId;*/
        $scope.loadCurrentSong = function() {

            $scope.trackLoaded = false;
            $scope.trackLoadStatus = 1;
            var success = function(data) {


                if (data !== undefined && data.audio_url !== undefined) {

                    $rootScope.listenNowId = data.id;
                    $scope.currentAudioURL = $rootScope.apipath + data.audio_url;
                    $scope.retrievePromotersByAudioID(data.audio_id, $scope.currentAudioURL);

                } else {
                    $scope.trackLoadStatus = 3;
                    $rootScope.showAlertMessage($rootScope.MESSAGES.NO_LISTEN_NOW_MSG);
                    var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };

            var failure = function(response) {
                $scope.trackLoadStatus = 3;
                var alertMsg = "Oops! something went wrong\nServer responded with " + response.status + " " + response.statusText;
                $rootScope.showAlertMessage(alertMsg);
                //alert("Oops! something went wrong\nServer responded with " + response.status + " " + response.statusText);
                
                var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            };

            ListenNowService.getCurrentSong(success, failure);
        };

        $scope.initializeNextSong = function() {
            $scope.trackLoadStatus = 1;
            $scope.trackLoaded = false;

            var success = function(data) {
                $scope.loadCurrentSong();
            };

            var failure = function(response) {
                $scope.trackLoadStatus = 3;
                //alert("Oops! something went wrong\nServer responded with " + response.status + " " + response.statusText);
                var alertMsg = "Oops! something went wrong\nServer responded with " + response.status + " " + response.statusText;
                $rootScope.showAlertMessage(alertMsg);
                var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            };

            ListenNowService.getNextSong(success, failure);
        };

        $scope.retrievePromotersByAudioID = function(audioId, audioUrl) {

            var i = 0;
            var totalPromoters;
            var promoters = [];
            var promoterIds = [];
            var promoterId;
            var audioData = {};
            var promoterExists = function(promoterId) {
                if (promoterId === undefined || promoterId === '')
                    return false;
                return promoterIds.indexOf(promoterId) > -1;
            };

            var successAudioData = function(data) {

                audioData.id = audioId;
                //audioDetails.audio_id=promotion.audio_id;

                if (data.audio !== undefined) {

                    audioData.album = data.audio.album;
                    audioData.title = data.audio.title;
                    audioData.length = parseInt((parseFloat(data.audio.length) / 1000));
                    audioData.date = data.audio.date_added;
                    audioData.ownerId = data.audio.owner_id;
                    audioData.audioUrl = audioUrl;
                    //audioDetails.year=data.audio.year;                                        
                    loadOwnerInfo();
                }

            };

            var successOwnerInfo = function(data) {

                if (data.user !== undefined) {
                    audioData.ownerInfo = data.user;
                } else {
                    audioData.ownerInfo = {};
                }

                setIconImage();
            };
            var failureOwnerInfo = function(data) {
                audioData.ownerInfo = {};
            };

            var loadOwnerInfo = function() {
                audioData.ownerInfo = {};
                UserService.getUser({id: audioData.ownerId}, {}, successOwnerInfo, failureOwnerInfo);
            };

            var setPromoters = function() {
                PromotionService.getPromotion({audio_id: audioData.id}, {}, success, failure);
            };

            var success = function(data) {

                if (data.promotions !== undefined) {

                    $scope.promotions = data.promotions;
                    totalPromoters = $scope.promotions.length;
                    if (totalPromoters > 0) {
                        angular.forEach($scope.promotions, function(promotion) {

                            promoterId = promotion.promoter_id;
                            UserImageService.getImage({image_type: 'profile', user_id: promotion.promoter_id}, {}, successUser, failure);
                        });
                    } else {
                        setTrack();
                    }

                } else {
                    var msg = $rootScope.RETRIEVE_PROMOTERS_FAILED;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };

            var failure = function() {

                var msg = $rootScope.RETRIEVE_PROMOTERS_FAILED;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            };

            var successUser = function(data) {

                var user = {};

                if (data.user_images.length > 0) {
                    user.imageURL = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                    user.id = data.user_images[data.user_images.length - 1].user_id;
                } else {
                    user.imageURL = "";
                    user.id = promoterId;
                }
                //console.log("image====== "+JSON.stringify(data));
                //if(!promoterExists(user.id)){                    
                promoterIds.push(user.id);
                promoters.push(user);
                //}                

                i = i + 1;

                if (parseInt(totalPromoters) === parseInt(i)) {
                    setTrack();
                }

            };

            var setIconImage = function() {
                UserImageService.getImage({image_type: 'icon', user_id: audioData.ownerId}, {}, successIconImage, failure);
            };

            var successIconImage = function(data) {
                if (data.user_images.length > 0) {
                    audioData.iconURL = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                } else {
                    audioData.iconURL = "";
                }
                setPromoters();
            };

            var setTrack = function() {
                UserImageService.getImage({image_type: 'profile', user_id: audioData.ownerId}, {}, successUserImage, failure);
            };

            var successUserImage = function(data) {

                audioData.promoters = promoters;

                if (data.user_images.length > 0) {
                    audioData.imageURL = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                } else {
                    audioData.imageURL = "";
                }

                $scope.currentTrack = audioData;
                $scope.trackLoaded = true;
                $scope.trackLoadStatus = 2;
                $rootScope.setListeningSongCreditDetails($scope.currentTrack.id, true, 0, false);//(songId,creditAvailable,playedDuration,creditApproved);
                if($scope.isDirectPlay === true){
                    $scope.playCurrentTrack();
                }
                //console.log("This song has 5 credits that u will get after listening it for " + $rootScope.CONSTANTS.SONG_CREDIT_DURATION + "sec");

            };

            AudioService.getAudio({audio_id: audioId}, successAudioData, failure);

        };



        $scope.skipTrack = function() {
            
            if($scope.trackLoadStatus===1){
                //$rootScope.showAlertMessage($rootScope.MESSAGES.WAIT_PROCESSING_LAST_REQUEST);
                return;
            }
            
            $rootScope.audioPlaylist = [];
            $scope.currentTrack = {title: ' '};            
            $scope.isDirectPlay = true;
            $rootScope.promoteTrack = {};
            $rootScope.promoterInfo = {};            
            $rootScope.updateCurrentPlayingTrack({},{});//(track,ownerInfo)
            $scope.initializeNextSong();

        };

    }
]);
