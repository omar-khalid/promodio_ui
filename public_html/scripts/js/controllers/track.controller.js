'use strict';
/* Controller Module */

promodControllers.controller('TrackController', ['$scope', '$rootScope', '$http', '$timeout', '$location', 'AudioService', 'PromotionService', 'ListenNowService', 'PlayerService', 'UserService', 'UserImageService', function ($scope, $rootScope, $http, $timeout, $location, AudioService, PromotionService, ListenNowService, PlayerService, UserService, UserImageService) {

        $scope.$on('$viewContentLoaded', function () {

            $scope.currentTracks = $rootScope.TRACK_LOAD_LIMIT;
            ///////////////////////$scope.retrievePromotedAudios();//retrieve all of your promoted audio
            //$scope.retrieveUploadedAudios();//retrieve all of your uploaded audio (then will call $scope.retrievePromotedAudios();)
            $scope.loadTracksV1();
        });

        $rootScope.currentPage = 'tracks';
        $rootScope.clearAlertMessages();
        $scope.responseCompleted = false;
        $scope.currentTracks = 8;

        $scope.totalTracks = 0;
        $scope.totalUploadedTracks = 0;
        $rootScope.tracks = [];
        //$scope.tracksIds = [];
        $scope.audioPromoters = {promoters: []};
        $scope.promotersLength;
        $rootScope.promoters = [];
        $rootScope.promotersIds = [];
        $scope.promotersTrackView = false;
        $scope.userCoverImageUrl = '';
        $scope.userProfileImageUrl = '';
        $scope.selectedPromoterId = '';
        $rootScope.tracksIds = [];
        $scope.tracksAvailableToLoad = false;
        $scope.tracksLoadStatus = 0;//0-initial, 1-processing,2-success,3-failure
        $scope.trackInitializationStatus = 0;

        /**Dynamic Support to Load Audio Tracks***/
        $rootScope.loadMoreTracks = function () {
            if ($scope.tracksLoadStatus !== 1)
                $scope.loadTracks();
        };

        $scope.removeMyPromotion = function (track, index) {
            $rootScope.demoteTrack = track;
            $rootScope.demoteResult = false;
            $rootScope.requestingPage = 'tracks';
            $rootScope.demotedTrackIndex = index;
            $scope.loadDemoterInfo(track.ownerId);
            $rootScope.openDemoteTrackModal();
        };
        $scope.removeMyOtherPromotion = function (track, index) {
            $rootScope.demoteTrack = track;
            $rootScope.demoteResult = false;
            $rootScope.requestingPage = 'othertracks';
            $rootScope.demotedTrackIndex = index;
            $scope.loadDemoterInfo(track.ownerId);
            $rootScope.openDemoteTrackModal();
        };
        $scope.addMyPromotion = function (track) {
            $rootScope.backupPlayerPromoteTrack();
            $rootScope.isDirectPromotion = true;
            $rootScope.promoteTrack = track;
            $rootScope.promoteResult = false;
            $rootScope.promotionPage = 'tracks';
            $scope.loadPromoterInfo(track.ownerId, false);
            $rootScope.openPromoteTrackModal();
        };
        $scope.addMyOtherPromotion = function (track) {
            $rootScope.backupPlayerPromoteTrack();
            $rootScope.isDirectPromotion = true;
            $rootScope.promoteTrack = track;
            $rootScope.promoteResult = false;
            $rootScope.promotionPage = 'othertracks';
            $scope.loadPromoterInfo(track.ownerId, false);
            $rootScope.openPromoteTrackModal();
        };
        $scope.loadTracks = function () {

            var startIndex = $rootScope.tracks.length;
            var endIndex = startIndex + $rootScope.TRACK_LOAD_LIMIT - 1;

            if (endIndex >= $rootScope.tracksIds.length)
                endIndex = $rootScope.tracksIds.length - 1;

            if (startIndex > endIndex)
                return;

            $scope.totalTracksToLoad = endIndex - startIndex + 1;
            $scope.tracksLoaded = 0;
            $scope.tracksLoadStatus = 1;//processing status

            for (var i = startIndex; i <= endIndex; i++) {
                $scope.loadTrackByAudioID($rootScope.tracksIds[i]);
            }
            ;
        };

        $scope.retrievePromotedAudios = function () {

            var success = function (data) {
                if (data.promotions !== undefined) {

                    angular.forEach(data.promotions, function (promotion) {
                        if ($scope.audioExists(promotion.audio_id)) {
                            //audio already added no need to add                                                                                   
                        } else {
                            if ($rootScope.currentPage === 'tracks')
                                $rootScope.tracksIds.push(promotion.audio_id);
                        }
                    });
                    $scope.totalTracks = $rootScope.tracksIds.length;
                    $scope.loadTracks();
                } else {
                    var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
                $scope.trackInitializationStatus = 2;
            };

            var failure = function () {
                var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
                $scope.trackInitializationStatus = 2;
            };

            PromotionService.getPromotion(success, failure);
        };

        $scope.retrieveUploadedAudios = function () {
            $scope.trackInitializationStatus = 1;
            var success = function (data) {

                if (data.audios !== undefined) {

                    $scope.audios = data.audios;

                    angular.forEach($scope.audios, function (audio) {
                        if ($scope.audioExists(audio.id)) {
                            //audio already added no need to add                            
                        } else {
                            if ($rootScope.currentPage === 'tracks')
                                $rootScope.tracksIds.push(audio.id);
                        }
                    });
                    $scope.retrievePromotedAudios();//retrieve all of your promoted audio

                } else {
                    var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                    $scope.trackInitializationStatus = 2;
                }
            };

            var failure = function () {

                var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
                $scope.trackInitializationStatus = 2;
            };

            AudioService.getAudio(success, failure);
        };

        $scope.loadTrackByAudioID = function (audioId) {

            var i = 0;
            var totalPromoters;
            var promoters = [];
            var promoterId;
            var audioData = {};
            var isMyPromotion = false;

            var failure = function () {

                var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            };

            var successUser = function (data) {

                var user = {};

                if (data.user_images!==undefined && data.user_images!==null && data.user_images.length > 0) {
                    user.imageURL = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                    user.id = data.user_images[data.user_images.length - 1].user_id;
                } else {
                    user.imageURL = "";
                    user.id = promoterId;
                }

                if (!$rootScope.promoterExists(user.id)) {
                    $rootScope.promotersIds.push(user.id);
                    $rootScope.promoters.push(user);
                } else {
                    var index = $rootScope.promotersIds.indexOf(user.id);
                    if (index >= 0) {
                        var oldUser = $rootScope.promoters[index];
                        if (oldUser.imageURL === "" && user.imageURL !== "") {
                            $rootScope.promoters[index] = user;
                        }
                    }
                }

                promoters.push(user);
                i = i + 1;

                if (parseInt(totalPromoters) === parseInt(i)) {
                    setIconImage();
                }

            };

            var setIconImage = function () {
                UserImageService.getImage({image_type: 'icon', user_id: audioData.ownerId}, {}, successIconImage, failure);
            };

            var successIconImage = function (data) {
                if (data.user_images!==undefined && data.user_images!==null && data.user_images.length > 0) {
                    audioData.iconURL = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                } else {
                    audioData.iconURL = "";
                }
                setTrack();
            };

            var setTrack = function () {
                UserImageService.getImage({image_type: 'profile', user_id: audioData.ownerId}, {}, successUserImage, failure);
            };

            var successUserImage = function (data) {

                audioData.promoters = promoters;
                audioData.isMyPromotion = isMyPromotion;

                if (data.user_images!==undefined && data.user_images!==null && data.user_images.length > 0) {
                    audioData.imageURL = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                } else {
                    audioData.imageURL = "";
                }
                if ($rootScope.currentPage === 'tracks' && $scope.audioExists(audioData.id))
                    $rootScope.tracks.push(audioData);
                $scope.tracksLoaded = $scope.tracksLoaded + 1;
                $scope.responseCompleted = true;

                if ($scope.totalTracksToLoad === $scope.tracksLoaded)
                {
                    $scope.tracksLoadStatus = 2;//success(complete processing) status
                    if ($rootScope.tracks.length < $rootScope.tracksIds.length)
                        $scope.tracksAvailableToLoad = true;
                    else
                        $scope.tracksAvailableToLoad = false;
                }
            };

            var successPromoters = function (data) {
                isMyPromotion = false;
                if (data.promotions !== undefined) {

                    $scope.promotions = data.promotions;
                    totalPromoters = $scope.promotions.length;

                    if (totalPromoters > 0) {
                        angular.forEach($scope.promotions, function (promotion) {

                            promoterId = promotion.promoter_id;
                            if ($rootScope.isCurrentUserId(promoterId)) {
                                isMyPromotion = true;
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

            var setPromoters = function () {
                PromotionService.getPromotion({audio_id: audioId}, {}, successPromoters, failure);
            };

            var successAudioData = function (data) {

                if (data.audio !== undefined) {

                    audioData.id = data.audio.id;
                    audioData.title = data.audio.title;
                    audioData.date = data.audio.date_added;
                    audioData.ownerId = data.audio.owner_id;
                    audioData.length = parseInt((parseFloat(data.audio.length) / 1000));
                    setPromoters();
                } else {
                    var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };

            AudioService.getAudio({audio_id: audioId}, successAudioData, failure);

        };

        $scope.audioExists = function (audioId) {
            if (audioId === undefined || audioId === '')
                return false;
            return $rootScope.tracksIds.indexOf(audioId) > -1;
        };


        /**Dynamic Support to Load Audio Tracks End for TRACKS***/

        $scope.otherUsersAudioExists = function (audioId) {
            if (audioId === undefined || audioId === '')
                return false;
            return $scope.otherUsersAudioIds.indexOf(audioId) > -1;
        };

        $scope.otherUsersTracks = [];
        $scope.otherUsersTotalTracks = 0;
        $scope.otherUsersAudioIds = [];
        $scope.otherUsersAudios = [];
        $scope.otherUsersTracksAvailableToLoad = false;
        $scope.otherUsersTracksLoadStatus = 0;//0-initial, 1-processing,2-success,3-failure

        $scope.loadMoreOtherUserTracks = function () {
            if ($scope.otherUsersTracksLoadStatus !== 1)
                $scope.loadOtherUsersTracks();
        };

        $scope.loadOtherUsersTracks = function (userId) {

            var startIndex = $scope.otherUsersTracks.length;
            var endIndex = startIndex + $rootScope.TRACK_LOAD_LIMIT - 1;

            if (endIndex >= $scope.otherUsersAudios.length)
                endIndex = $scope.otherUsersAudios.length - 1;
            if (startIndex > endIndex)
                return;

            $scope.otherUsersTotalTracksToLoad = endIndex - startIndex + 1;
            $scope.otherUserTracksLoaded = 0;
            $scope.otherUsersTracksLoadStatus = 1;//processing status
            for (var i = startIndex; i <= endIndex; i++) {
                $scope.retrievePromotersByAudio($scope.otherUsersAudios[i],userId);
            }
            ;
        };
        $scope.loadTrackByUser = function (userId) {

            $scope.otherUsersTracks = [];
            $scope.otherUsersAudioIds = [];
            $scope.otherUsersAudios = [];
            var success = function (data) {

                if (data.audios !== undefined) {

                    $scope.audios = data.audios;
                    $scope.otherUsersTotalTracks = $scope.audios.length;

                    angular.forEach($scope.audios, function (audio) {

                        if ($scope.otherUsersAudioExists(audio.id)) {
                            //audio already exists no need to add
                        } else {
                            $scope.otherUsersAudioIds.push(audio.id);
                            $scope.otherUsersAudios.push(audio);
                        }
                    });
                    if ($scope.otherUsersAudioIds.length > 0)
                        $scope.loadOtherUsersTracks(userId);
                    else
                        $scope.noOtherTracksFound = true;

                } else {
                    var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };

            var failure = function () {

                var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            };

            AudioService.getAudioByUser({user_id: userId}, success, failure);
        };
        
        
        
        
        
        
        
        

        $scope.retrievePromotersByAudio = function (audio,userId) {

            var i = 0;
            var totalPromoters;
            var promoters = [];
            var promoterId;
            var audioData = {};
            var isMyPromotion = false;
            var success = function (data) {
                isMyPromotion = false;
                if (data.promotions !== undefined) {

                    $scope.promotions = data.promotions;
                    totalPromoters = $scope.promotions.length;

                    if (totalPromoters > 0) {
                        angular.forEach($scope.promotions, function (promotion) {
                            promoterId = promotion.promoter_id;
                            if ($rootScope.isCurrentUserId(promoterId)) {
                                isMyPromotion = true;
                            }
                            UserImageService.getImage({image_type: 'profile', user_id: promotion.promoter_id}, {}, successUser, failure);
                        });
                    } else {
                        setAudioIcon();
                    }

                } else {
                    var msg = $rootScope.RETRIEVE_PROMOTERS_FAILED;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };

            var failure = function () {

                var msg = $rootScope.RETRIEVE_PROMOTERS_FAILED;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            };

            var successUser = function (data) {

                var user = {};

                if (data.user_images!==undefined && data.user_images!==null && data.user_images.length > 0) {
                    user.imageURL = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                    user.id = data.user_images[data.user_images.length - 1].user_id;
                } else {
                    user.imageURL = "";
                    user.id = promoterId;
                }
                
                 if (!$rootScope.promoterExists(user.id) && userId === $rootScope.trackLoadData.ownerId) {
                    $rootScope.promotersIds.push(user.id);
                    $rootScope.promoters.push(user);
                } else {
                    var index = $rootScope.promotersIds.indexOf(user.id);
                    if (index >= 0) {
                        var oldUser = $rootScope.promoters[index];
                        if (oldUser.imageURL === "" && user.imageURL !== "") {
                            $rootScope.promoters[index] = user;
                        }
                    }
                }

                promoters.push(user);
                i = i + 1;
                
                if (parseInt(totalPromoters) === parseInt(i)) {
                    setAudioIcon();
                }

            };

            var setAudioIcon = function () {
                UserImageService.getImage({image_type: 'icon', user_id: audio.owner_id}, {}, successUserIcon, failure);
            };

            var successUserIcon = function (data) {

                if (data.user_images!==undefined && data.user_images!==null && data.user_images.length > 0) {
                    audioData.iconURL = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                } else {
                    audioData.iconURL = "";
                }

                setTrack();
            };

            var setTrack = function () {
                UserImageService.getImage({image_type: 'profile', user_id: audio.owner_id}, {}, successUserImage, failure);
            };

            var successUserImage = function (data) {


                audioData.id = audio.id;
                audioData.title = audio.title;
                audioData.date = audio.date_added;
                audioData.ownerId = audio.owner_id;
                audioData.length = parseInt((parseFloat(audio.length) / 1000));
                audioData.promoters = promoters;
                audioData.isMyPromotion = isMyPromotion;

                if (data.user_images!==undefined && data.user_images!==null && data.user_images.length > 0) {
                    audioData.imageURL = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                } else {
                    audioData.imageURL = "";
                }
                if ($scope.selectedPromoterId === audio.owner_id) {
                    $scope.otherUsersTracks.push(audioData);
                    $scope.otherUserTracksLoaded = $scope.otherUserTracksLoaded + 1;
                }
                if ($scope.otherUserTracksLoaded === $scope.otherUsersTotalTracksToLoad) {
                    if ($scope.otherUsersTracks.length < $scope.otherUsersAudios.length)
                        $scope.otherUsersTracksAvailableToLoad = true;
                    else
                        $scope.otherUsersTracksAvailableToLoad = false;
                    $scope.otherUsersTracksLoadStatus = 2;
                }

            };

            PromotionService.getPromotion({audio_id: audio.id}, {}, success, failure);
        };


        $scope.loadPromoterTracks = function (promoter) {

            if (promoter.id === $rootScope.session.id) {
                $rootScope.section = 1;
                return;
            }

            $scope.selectedPromoterId = promoter.id;
            $scope.otherUsersTotalTracks = 0;
            $scope.otherUsersTracksAvailableToLoad = false;
            $scope.otherUsersTracks = [];
            $scope.promotersTrackView = true;
            $scope.noOtherTracksFound = false;
            $scope.userProfileImageUrl = promoter.imageURL;
            $scope.promoterDetails = {};
            $scope.loadTrackByUser(promoter.id);

            function success(data) {
                if (data !== undefined && data.user_images !== undefined && data.user_images.length > 0) {

                    var coverImage = data.user_images[0].image_url;
                    if (coverImage !== undefined && coverImage !== null)
                        $scope.userCoverImageUrl = $rootScope.apipath + coverImage;
                    else
                        $scope.userCoverImageUrl = '';
                } else {
                    $scope.userCoverImageUrl = '';
                }
            }

            function failure(data) {
                $scope.userCoverImageUrl = '';
            }

            UserImageService.getCoverImage({user_id: promoter.id}, success, failure);

            $scope.loadPromotersDetails(promoter.id);
        };

        $scope.loadPromotersDetails = function (promoterId) {


            var success = function (data) {

                if (data.user !== undefined) {
                    $scope.promoterDetails = data.user;
                } else {
                    $scope.promoterDetails = {};
                }
            };
            var failure = function (data) {
                $scope.promoterDetails = {};
            };

            UserService.getUser({id: promoterId}, {}, success, failure);
        };


        $scope.trackExists = function (audioId) {
            if (audioId === undefined || audioId === '')
                return false;
            return $scope.tracksIds.indexOf(audioId) > -1;
        };

        $rootScope.promoterExists = function (promoterId) {
            if (promoterId === undefined || promoterId === '')
                return false;
            return $rootScope.promotersIds.indexOf(promoterId) > -1;
        };

        $scope.showPromoters = function (track) {
            $scope.section = 2;
            $scope.audioPromoters = angular.copy(track);
        };

        $scope.loadPromoterInfo = function (promoterId, isPlayingTrackInfo) {

            $rootScope.promoterInfo = {};
            var success = function (data) {

                if (data.user !== undefined) {
                    $rootScope.promoterInfo = data.user;
                    if (isPlayingTrackInfo) {
                        $rootScope.backupPromoteTrack(null, $rootScope.promoterInfo);//(promoteTrack,promoterInfo)
                        $rootScope.updateCurrentPlayingTrack(null, $rootScope.promoterInfo);//(track,ownerInfo)
                    }
                } else {
                    $rootScope.promoterInfo = {};
                }
            };
            var failure = function (data) {
                $rootScope.promoterInfo = {};
            };

            UserService.getUser({id: promoterId}, {}, success, failure);
        };

        $scope.loadDemoterInfo = function (promoterId) {

            $rootScope.demoterInfo = {};
            var success = function (data) {

                if (data.user !== undefined) {
                    $rootScope.demoterInfo = data.user;
                } else {
                    $rootScope.demoterInfo = {};
                }
            };
            var failure = function (data) {
                $rootScope.demoterInfo = {};
            };

            UserService.getUser({id: promoterId}, {}, success, failure);
        };

        $scope.playNow = function (track) {

            $rootScope.shouldPlayNextTrack = false;
            $rootScope.listeningSongCreditDetails = {};
            $rootScope.promoteTrack = track;
            $rootScope.promoteResult = false;
            $rootScope.backupPromoteTrack(track, {});//(promoteTrack,promoterInfo)
            $scope.loadPromoterInfo(track.ownerId, true);
            if ($rootScope.mediaPlayer.playing)
                $rootScope.mediaPlayer.pause();
            $rootScope.currentTrack = track;
            $rootScope.updateCurrentPlayingTrack(track, {});//(track,ownerInfo)
            var success = function (data) {

                $scope.currentAudioURL = $rootScope.apipath + data.audio_url;

                $rootScope.audioPlaylist = [];
                $rootScope.audioPlaylist.push({src: $scope.currentAudioURL, type: 'audio/mpeg', artist: track.album, title: track.title});

                $timeout(function () {
                    $rootScope.mediaPlayer.play();
                }, 10);
            };

            var failure = function () {
            };

            PlayerService.setAudioToPlay({'audio_id': track.id}, {}, success, failure);
        };

        $rootScope.$on("loadAudioTracksV1", function () {
            $rootScope.loadTracksV1();
        });

        $rootScope.isMyProfile = true;
        $rootScope.loadTracksV1 = function () {
            $rootScope.currentPage = 'tracks';
            $rootScope.tracksIds = [];
            $rootScope.tracks = [];
            $rootScope.promoters = [];
            $rootScope.promotersIds = [];
            $scope.tracksAvailableToLoad = false;
            $scope.otherUsersTracksAvailableToLoad = false;
            $scope.tracksLoadStatus = 0;//0-initial, 1-processing,2-success,3-failure
            $scope.trackInitializationStatus = 0;
            
            if ($rootScope.trackLoadData.isViewPromoters === true)
                $rootScope.section = 2;
            else
                $rootScope.section = 1;

            if ($rootScope.trackLoadData.isLoadOthersTrack === true) {
                //show other user tracks i.e $rootScope.trackLoadData.ownerId
                $rootScope.promotersTrackView = true;
                $rootScope.isMyProfile = false;
                $rootScope.section = 1;
                $scope.selectedPromoterId=$rootScope.trackLoadData.promoter.id;
                $scope.loadPromoterTracks($rootScope.trackLoadData.promoter);
                //alert("other users track id=" + $rootScope.trackLoadData.ownerId);
            } else {
                //show current user(own) tracks  
                $scope.promotersTrackView = false;//will show current user name & image
                $rootScope.isMyProfile = true;
                $rootScope.trackLoadData.ownerId = $rootScope.session.id;
                $scope.retrieveUploadedAudios();
            }

        };
    }
]);
