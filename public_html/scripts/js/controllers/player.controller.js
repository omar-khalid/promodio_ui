'use strict';
/* Controller Module */

promodControllers.controller('PlayerController', ['$scope', '$rootScope', '$http', '$animate','$timeout', 'UserService','ListenNowService','PromotionService','UserImageService','AudioService', function($scope, $rootScope, $http, $animate, $timeout, UserService,ListenNowService,PromotionService,UserImageService,AudioService) {

        $scope.$on('$viewContentLoaded', function() {
        });


//        $rootScope.audioUrlList = [
//            {url: 'http://upload.wikimedia.org/wikipedia/en/b/be/My_Name_Is.ogg', displayName: 'Free Test Album - Demo Song Ogg'},
//            {url: 'http://68.169.56.112/audios/c96eb072-d453-11e4-a1a5-00163e6c9cf9.mp3', displayName: 'Free Test Album - Demo Song Mp3'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/6/6c/NirvanaSmellsLikeTeenSpirit.ogg', displayName: 'Free Test Album - Smells Like Teen Spirit'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/c/c4/Radiohead_-_Creep_%28sample%29.ogg', displayName: 'Free Test Album - Creep test test'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', displayName: 'Free Test Album - Live Forever'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/6/65/Eagles_-_Hotel_California.ogg', displayName: 'Free Test Album - Hotel California'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', displayName: 'Free Test Album - Stairway to Heaven'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Pink_floyd_another_brick_in_the_wall_part_2.ogg', displayName: 'Free Test Album - Pink Lips Another Brick in the Wall'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', displayName: 'Free Test Album - Pink Lips Come Together'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', displayName: 'Free Test Album - Indian pop Layla'}
//        ];

        $rootScope.audioPlaylist = [];
        $rootScope.currentPlayingTrack={};
        $rootScope.updateCurrentPlayingTrack = function(track,ownerInfo){
            if(track!==null)
                $rootScope.currentPlayingTrack.track = track;
            if(ownerInfo!==null)
                $rootScope.currentPlayingTrack.ownerInfo = ownerInfo;
        };

//        $rootScope.audioPlaylist = $rootScope.audioUrlList.map(function(song, index, array) {
//            var parseTitle = song.displayName.match(/(.*?)\s?-\s?(.*)?$/);
//            if (index >= 1 && index <= 4)
//                return {src: song.url, type: 'audio/mpeg', artist: parseTitle[1], title: parseTitle[2]};
//            return {src: song.url, type: 'audio/ogg', artist: parseTitle[1], title: parseTitle[2]};
//        });

        $rootScope.playMySong=function(){
            if($rootScope.audioPlaylist.length>0)
                $rootScope.mediaPlayer.play();
            else
                alert($rootScope.MESSAGES.NO_SONG_FOUND_TO_PLAY);
        };
        
        $rootScope.setVolume = function(volume) {
            $rootScope.volumeValue = volume;
            $rootScope.mediaPlayer.setVolume(volume / 100.0);

            if ($rootScope.mediaPlayer.muted) {
                $rootScope.mediaPlayer.toggleMute();
            }
        };

        $rootScope.setVolumeEvent = function($event)
        {
            var percentage = ($event.offsetX / $event.target.offsetWidth);
            var seekPercentage = 0;
            if (percentage <= 1) {
                seekPercentage = percentage;
            }
            $rootScope.mediaPlayer.setVolume(seekPercentage);
        };

        $rootScope.setProgress = function(seekPercentage) {
            $rootScope.progressValue = seekPercentage;
            $rootScope.mediaPlayer.seek($rootScope.mediaPlayer.duration * (seekPercentage / 100.0));
        };

        $rootScope.mediaPlayerData = {};
        $rootScope.mediaPlayerData.progressValue = 0;

        $rootScope.mediaPlayerData.progressOptions = {
            from: 0,
            to: 100,
            step: 1,
            dimension: '%',
            vertical: false,
            smooth: true,
            realtime: true,
            css: {
                background: {'background-color': '#4a5c70'},
                before: {'background-color': '#F48282'},
                default: {'background-color': '#4a5c70'},
                after: {'background-color': '#F48282'},
                pointer: {'background-color': '#F48282'}
            }
        };

        $rootScope.mediaPlayerData.volumeValue = 100;

        $rootScope.mediaPlayerData.volumeOptions = {
            from: 0,
            to: 100,
            step: 1,
            //dimension: '%',
            vertical: false,
            smooth: true,
            realtime: true,
            css: {
                background: {'background-color': '#4a5c70'},
                before: {'background-color': '#F48282'},
                default: {'background-color': '#4a5c70'},
                after: {'background-color': '#F48282'},
                pointer: {'background-color': '#F48282'}
            }
        };

        $rootScope.toggleMute = function() {

            if ($rootScope.mediaPlayer.muted) {

                $rootScope.mediaPlayerData.volumeValue = ($rootScope.mediaPlayer.volume * 100);
                $rootScope.mediaPlayer.toggleMute();

            } else {
                if ($rootScope.mediaPlayer.volume <= 0) {

                    $rootScope.mediaPlayer.setVolume(0.75);
                    $rootScope.mediaPlayerData.volumeValue = 75;

                } else {
                    $rootScope.mediaPlayer.toggleMute();
                    $rootScope.mediaPlayerData.volumeValue = 0;
                }
            }
        };

        $rootScope.myconsole = console;

        $rootScope.$watch(function() {
            return $rootScope.mediaPlayer.currentTime;
        }, function(newVal, oldVal) {
            var progress = Math.round($rootScope.mediaPlayer.currentTime * 100 / $rootScope.mediaPlayer.duration);
            if (progress > -1)
                $rootScope.updateProgress(progress);
        });

        $rootScope.$watch(function() {
            return $rootScope.mediaPlayer.loadPercent;
        }, function(newVal, oldVal) {

            $("#audio-prabhat-argus-seek").css("width", $rootScope.mediaPlayer.loadPercent + "%");
            $("#audio-prabhat-argus-seek").css("background-color", "#808D9B");
            $("#audio-prabhat-argus-seek").css("margin-left", "2px");
            $("#audio-prabhat-argus-seek").css("border-radius", "20px");

        });

        $rootScope.updateProgress = function(progress) {
            if (progress !== undefined)
                $rootScope.mediaPlayerData.progressValue = progress;
        };

        $rootScope.seek = function($event) {

            var percentage = ($event.offsetX / $event.target.offsetWidth);
            var seekPercentage = 0;
            if (percentage <= 1) {
                seekPercentage = percentage;
            }
            $rootScope.mediaPlayer.seek($rootScope.mediaPlayer.duration * seekPercentage);
        };        
        
        /******************Code to handle Next******************/
        $rootScope.nextSongStatus=0;//0 - initial, 1 - processing, 2 - success, 3 - failure
        $scope.currentTrack = {title: '  '};
        $scope.trackLoaded = false;
        $scope.playingTrack = false;
        $rootScope.playNextSong=function(){              
            $rootScope.listeningSongCreditDetails={};
            if($rootScope.nextSongStatus===1){
                $rootScope.showAlertMessage($rootScope.MESSAGES.WAIT_PROCESSING_LAST_REQUEST);
                return;
            }                        
            $rootScope.nextSongStatus=1;
            
            $scope.initializeNextSong();
        };
        
        $rootScope.listeningSongCreditDetails = {songId: '', creditAvailable: false, playedDuration: 0, creditApproved: false};

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
                        //console.log("playedDuration " + $scope.listeningSongCreditDetails.playedDuration);
                        $rootScope.listeningSongCreditDetails.playedDuration++;
                        if ($rootScope.listeningSongCreditDetails.playedDuration > $rootScope.CONSTANTS.SONG_CREDIT_DURATION) {
                            //console.log("5 points credited to this song");
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
                    //console.log(response);
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
            $rootScope.nextSongStatus=2;
        };
        
        $rootScope.listenNowId;
        $scope.loadCurrentSong = function() {

            $scope.trackLoaded = false;
            var success = function(data) {


                if (data !== undefined && data.audio_url !== undefined) {

                    $rootScope.listenNowId = data.id;
                    $scope.currentAudioURL = $rootScope.apipath + data.audio_url;
                    $scope.retrievePromotersByAudioID(data.audio_id, $scope.currentAudioURL);

                } else {
                    $rootScope.nextSongStatus=3;
                    var msg = $rootScope.RETRIEVE_AUDIO_FAILURE;
                    $rootScope.showAlertMessage(msg);
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };

            var failure = function(response) {
                $rootScope.nextSongStatus=3;
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

            $scope.trackLoaded = false;

            var success = function(data) {
                $scope.loadCurrentSong();
            };

            var failure = function(response) {
                $rootScope.nextSongStatus=3;
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
                $rootScope.setListeningSongCreditDetails($scope.currentTrack.id, true, 0, false);//(songId,creditAvailable,playedDuration,creditApproved);
                $scope.playCurrentTrack();
                //console.log("This song has 5 credits that u will get after listening it for " + $rootScope.CONSTANTS.SONG_CREDIT_DURATION + "sec");

            };

            AudioService.getAudio({audio_id: audioId}, successAudioData, failure);

        };

        /******************End Code to handle Next******************/
    }
]);
