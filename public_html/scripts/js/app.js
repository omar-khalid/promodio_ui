'use strict';
/* App Module */

var promod = angular.module('promod', [
    'ngRoute', 'ngResource', 'ngTouch',
    'promod.controllers', 'promod.directives', 'mediaPlayer', 'ngSlider', 'lazyScroller']);

promod.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainController'
                }).
                when('/addsong', {
                    templateUrl: 'views/addsong.html',
                    controller: 'AddSongController'
                }).
                when('/registration', {
                    templateUrl: 'views/registration.html'
                }).
                when('/settings', {
                    templateUrl: 'views/settings.html',
                    controller: 'SettingsController'
                }).
                when('/promod', {
                    templateUrl: 'views/mypromoters.html',
                    controller: 'TrackController'
                }).
                when('/home', {
                    templateUrl: 'views/home.html',
                    controller: 'HomeController'
                }).
                when('/listennow', {
                    templateUrl: 'views/listennow.html',
                    controller: 'ListennowController'
                }).
                otherwise({
                    redirectTo: '/'
                });
    }]);

promod.run(['$rootScope', '$timeout', '$location', 'CommonOperation', function($rootScope, $timeout, $location, CommonOperation) {

        $rootScope.apipath = "http://68.169.56.112";
        $rootScope.session = {};

        $rootScope.isLoggedIn = false;
        $rootScope.register = false;
        $rootScope.responseURL = "http://68.169.56.112/test/show";

        $rootScope.$on('$routeChangeStart', function(event, current, previous) {

            $rootScope.validations = [];
            $rootScope.url = $location.path();

        });

        $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
            $rootScope.scrollFunc('top');
        });

        $rootScope.success = "alert-success";
        $rootScope.failure = "alert-danger";
        $rootScope.warning = "alert-warning";
        $rootScope.successTimeout = 20000;
        $rootScope.failureTimeout = 20000;
        $rootScope.warningTimeout = 20000;
        $rootScope.validations = [];

        $rootScope.addMessage = function(msg, type, multiple) {
            if (multiple === undefined) {
                $rootScope.validations = [];
            }
            var message = {
                msg: msg,
                type: type
            };
            $rootScope.validations.push(message);
            if (type === $rootScope.success) {
                $rootScope.timeout = $rootScope.successTimeout;
            }
            else if (type === $rootScope.failure) {
                $rootScope.timeout = $rootScope.failureTimeout;
            }
            else if (type === $rootScope.warning) {
                $rootScope.timeout = $rootScope.warningTimeout;
            }
            if ($rootScope.timeout) {
                $timeout(function() {
                    $rootScope.closeAlertMessage($rootScope.validations.indexOf(message));
                }, $rootScope.timeout);
            }
        };

        $rootScope.closeAlertMessage = function(index) {
            $rootScope.validations.splice(index, 1);
        };

        $rootScope.clearAlertMessages = function() {
            $rootScope.validations = [];
        };

        $rootScope.profileImageUrl = '';

        $rootScope.getProfileImage = function() {

            function success(data) {
                if (data !== undefined && data.user_images !== undefined && data.user_images.length > 0) {
                    $rootScope.profileImageUrl = $rootScope.apipath + data.user_images[data.user_images.length - 1].image_url;
                } else {
                    $rootScope.profileImageUrl = '';
                }
            }

            function failure(data) {
                $rootScope.profileImageUrl = '';
            }

            CommonOperation.getProfileImage(success, failure);
        };

        $rootScope.coverImageUrl = '';

        $rootScope.getCoverImage = function() {

            function success(data) {
                if (data !== undefined && data.user_images !== undefined && data.user_images.length > 0) {

                    var coverImage = data.user_images[0].image_url;
                    if (coverImage !== undefined && coverImage !== null)
                        $rootScope.coverImageUrl = $rootScope.apipath + coverImage;
                    else
                        $rootScope.coverImageUrl = '';
                } else {
                    $rootScope.coverImageUrl = '';
                }
            }

            function failure(data) {
            }

            CommonOperation.getCoverImage(success, failure);
        };

        $rootScope.iconImageUrl = '';

        $rootScope.getIconImage = function() {

            function success(data) {
                if (data !== undefined && data.user_images !== undefined && data.user_images.length > 0) {

                    var iconImage = data.user_images[0].image_url;
                    if (iconImage !== undefined && iconImage !== null)
                        $rootScope.iconImageUrl = $rootScope.apipath + iconImage;
                    else
                        $rootScope.iconImageUrl = '';
                } else {
                    $rootScope.iconImageUrl = '';
                }
            }

            function failure(data) {
            }

            CommonOperation.getIconImage(success, failure);
        };

        $rootScope.getProfileImage();
        $rootScope.getCoverImage();
        $rootScope.getIconImage();

        $rootScope.pingServer = function() {

            function success(data) {
                $rootScope.session = data.user;
                if (data.user === undefined) {
                    $rootScope.isLoggedIn = false;
                    $location.path('/');
                } else {
                    $rootScope.isLoggedIn = true;
                    if ($location.path() === '/') {
                        $location.path('/home');
                    }
                }
            }

            function failure(data) {
                $rootScope.isLoggedIn = false;
                $location.path('/');
            }

            CommonOperation.getUser(success, failure);
        };

        $rootScope.lastCreditValue = 0;
        $rootScope.newCreditValue = 0;
        $rootScope.currentSongEarnings = 0;

        $rootScope.updateCredits = function() {

            $rootScope.lastCreditValue = $rootScope.session.credit_value;
            function success(data) {
                if (data.user.credit_value !== undefined) {
                    $rootScope.newCreditValue = $rootScope.session.credit_value = data.user.credit_value;
                    $rootScope.currentSongEarnings = $rootScope.newCreditValue - $rootScope.lastCreditValue;
                    if ($rootScope.currentSongEarnings === undefined)
                        $rootScope.currentSongEarnings = 0;
                    $rootScope.showAlertMessage($rootScope.MESSAGES.SONG_LISTENING_CREDIT_PAYMENT_SUCCESS);
                    var msg = $rootScope.MESSAGES.SONG_LISTENING_CREDIT_PAYMENT_SUCCESS;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                } else {
                    $rootScope.showAlertMessage($rootScope.MESSAGES.UPDATE_CREDIT_FAILURE);
                }
            }

            function failure(response) {
                $rootScope.showAlertMessage($rootScope.MESSAGES.UPDATE_CREDIT_FAILURE + "\nServer responded with " + response.status + " " + response.statusText);
                var msg = $rootScope.MESSAGES.UPDATE_CREDIT_FAILURE;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            }

            CommonOperation.getUser(success, failure);
        };

        $rootScope.arrayContains = function(searchString, array) {
            if (searchString !== undefined && array !== undefined && array.length > 0) {
                return array.indexOf(searchString) > -1;
            }
            return false;
        };

        $rootScope.isCurrentUserId = function(id) {
            if ($rootScope.session.id !== undefined && $rootScope.session.id !== '' && id !== undefined && id !== '' && $rootScope.session.id === id) {
                return true;
            }
            return false;
        };

        $rootScope.pingServer();
        $rootScope.section = 1;
        $rootScope.navigateToPage = function(page, section) {
            if (section === 1) {
                $rootScope.section = 1;
            } else if (section === 2) {
                $rootScope.section = 2;
            }
            $location.path(page);
        };

        $rootScope.scrollFunc = function(scrollToId) {
            var est = document.getElementById(scrollToId);
            var docPos = f_scrollTop();
            est.scrollIntoView();
            window.scrollTo(0, docPos);
        };

        function f_scrollTop() {
            return f_filterResults(
                    window.pageYOffset ? window.pageYOffset : 0,
                    document.documentElement ? document.documentElement.scrollTop : 0,
                    document.body ? document.body.scrollTop : 0
                    );
        }

        function f_filterResults(n_win, n_docel, n_body) {
            var n_result = n_win ? n_win : 0;
            if (n_docel && (!n_result || (n_result > n_docel)))
                n_result = n_docel;
            return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
        }

        $rootScope.isDirectPromotion = false;
        $rootScope.backup = {};
        $rootScope.backupPromoteTrack = function(promoteTrack, promoterInfo) {
            if (promoteTrack !== null)
                $rootScope.backup.promoteTrack = promoteTrack;
            if (promoterInfo !== null)
                $rootScope.backup.promoterInfo = promoterInfo;
        };

        $rootScope.backupPlayerPromoteTrack = function() {
            if ($rootScope.isDirectPromotion === false) {
                $rootScope.backup.promoteTrack = $rootScope.promoteTrack;
                $rootScope.backup.promoterInfo = $rootScope.promoterInfo;
            }
        };

        $rootScope.loadPromoteTrackFromBackup = function() {
            $rootScope.promoteTrack = $rootScope.backup.promoteTrack;
            $rootScope.promoterInfo = $rootScope.backup.promoterInfo;
        };

        $rootScope.promotePlayingTrack = function() {
            if ($rootScope.isDirectPromotion === true) {
                $rootScope.isDirectPromotion === false;
                $rootScope.loadPromoteTrackFromBackup();
            }
            $rootScope.openPromoteTrackModal();
        };

        $rootScope.openPromoteTrackModal = function() {
            if ($rootScope.promotionStatus === 1) {
                alert("Try later!\nLast promotion request is not yet completed");
                return;
            }
            $rootScope.promoteResult = false;
            $('#promoteTrackModal').modal('show');
        };

        $rootScope.openDemoteTrackModal = function() {
            if ($rootScope.demotionStatus === 1) {
                alert("Try later!\nLast demotion request is not yet completed");
                return;
            }
            $('#demoteTrackModal').modal('show');
        };

        $rootScope.openBuyCreditsModal = function() {
            $('#buyCreditsModal').modal('show');
        };

        $rootScope.promoteTrack;
        $rootScope.promoteResult = false;
        $rootScope.promotionStatus = 0;//0 - initial, 1- progress, 2 - complete

        $rootScope.promoteAudio = function() {
            $rootScope.promotionStatus = 1;
            var promoter = {};

            var success = function(data) {
                if (data.result.status === 'OK') {
                    $rootScope.promoteResult = true;
                    //code to update credit value
                    $rootScope.pingServer();
                    //$rootScope.session.credit_value = $rootScope.session.credit_value - $rootScope.CONSTANTS.CREDIT_USED_PER_SONG_PROMOTION;                    
                    promoter.id = $rootScope.session.id;
                    promoter.imageURL = $rootScope.profileImageUrl;
                    $rootScope.promoteTrack.promoters.push(promoter);
                    if ($rootScope.currentPlayingTrack !== undefined && $rootScope.currentPlayingTrack.track !== undefined && $rootScope.currentPlayingTrack.track.id === $rootScope.promoteTrack.id) {
                        $rootScope.currentPlayingTrack.track.promoters = $rootScope.promoteTrack.promoters;
                    }
                    $rootScope.promoteTrack.isMyPromotion = true;
                    $rootScope.promotionStatus = 2;
                    switch ($rootScope.promotionPage) {
                        case 'tracks':
                            if (!$rootScope.promoterExists(promoter.id)) {
                                $rootScope.promotersIds.push(promoter.id);
                                var user = {};
                                user.imageURL = promoter.imageURL;
                                user.id = promoter.id;
                                $rootScope.promoters.push(user);
                            }
                            break;
                        case 'othertracks':
                            if (!$rootScope.promoterExists(promoter.id)) {
                                $rootScope.promotersIds.push(promoter.id);
                                var user = {};
                                user.imageURL = promoter.imageURL;
                                user.id = promoter.id;
                                $rootScope.promoters.push(user);
                            }
                            updateTracks($rootScope.promoteTrack);
                            break;
                    }
                    $rootScope.promotionPage = '';
                } else {
                    $rootScope.promoteResult = 'fail';
                    $rootScope.promotionStatus = 2;
                }
            };

            var failure = function() {
                $rootScope.promoteResult = 'fail';
                $rootScope.promotionStatus = 2;
            };

            var updateTracks = function(promotedTrack) {
                //if current user track then simply update its isMyPromotion
                if ($rootScope.isCurrentUserId(promotedTrack.ownerId)) {
                    for (var index = 0; index < $rootScope.tracks.length; index++) {
                        var track = $rootScope.tracks[index];
                        if (track.id === promotedTrack.id) {
                            if ($rootScope.currentPage === 'tracks') {
                                $rootScope.tracks[index].isMyPromotion = true;
                                var user = {};
                                user.id = $rootScope.session.id;
                                user.imageURL = $rootScope.profileImageUrl;
                                $rootScope.tracks[index].promoters.push(user);
                            }
                        }
                    }
                } else {//add new promoted track
                    var newTracks = [];
                    var newTracksIds = [];
                    newTracks.push(promotedTrack);
                    newTracksIds.push(promotedTrack.id);
                    if ($rootScope.currentPage === 'tracks') {
                        $rootScope.tracks = newTracks.concat($rootScope.tracks);
                        $rootScope.tracksIds = newTracksIds.concat($rootScope.tracksIds);
                    }
                }

            };
            CommonOperation.promoteAudio({'audio_id': $rootScope.promoteTrack.id}, {}, success, failure);
        };

        $rootScope.demoteTrack;
        $rootScope.demoteResult = false;
        $rootScope.demotionStatus = 0;//0 - initial, 1- progress, 2 - complete

        $rootScope.demoteAudio = function() {
            $rootScope.demotionStatus = 1;
            var totalScuccess = 0;
            var totalPromotionsFound = 0;
            var myPromotionIds = [];

            var initiateDemotion = function(promotionID) {
                CommonOperation.demoteAudio({'id': promotionID}, {}, success, failure);
            };
            var success = function(data) {
                if (data.result.status === 'OK') {
                    totalScuccess++;
                    if (totalPromotionsFound === totalScuccess) {
                        removeMyPromotionsFromView($rootScope.demoteTrack.promoters);
                    }

                } else {
                    $rootScope.demoteResult = 'fail';
                    $rootScope.demotionStatus = 2;
                    //alert("Failed to demote");
                }
            };
            var failure = function() {
                $rootScope.demoteResult = 'fail';
                $rootScope.demotionStatus = 2;
                //alert("Failed to demote");
            };
            var removeMyPromotionsFromView = function(promoters) {
                if (promoters === undefined || promoters.length <= 0 || $rootScope.session.id === undefined || $rootScope.session.id === '')
                    return;
                var newPromotersList = [];
                angular.forEach(promoters, function(promoter) {
                    if (!$rootScope.isCurrentUserId(promoter.id)) {
                        newPromotersList.push(promoter);
                    }
                });
                $rootScope.demoteTrack.promoters = newPromotersList;
                if ($rootScope.currentPlayingTrack !== undefined && $rootScope.currentPlayingTrack.track !== undefined && $rootScope.currentPlayingTrack.track.id === $rootScope.demoteTrack.id) {
                    $rootScope.currentPlayingTrack.track.promoters = $rootScope.demoteTrack.promoters;
                    $rootScope.currentPlayingTrack = {};
                    $rootScope.backupPromoteTrack({}, {});
                    $rootScope.mediaPlayer.stop();
                    $rootScope.audioPlaylist = [];
                }
                $rootScope.demoteTrack.isMyPromotion = false;
                $rootScope.demoteResult = true;
                switch ($rootScope.requestingPage) {
                    case 'home':
                        $rootScope.tracks.splice($rootScope.demotedTrackIndex, 1);
                        $rootScope.tracksIds.splice($rootScope.demotedTrackIndex, 1);
                        break;
                    case 'tracks':
                        if (!$rootScope.isCurrentUserId($rootScope.demoteTrack.ownerId)) {
                            $rootScope.tracks.splice($rootScope.demotedTrackIndex, 1);
                            $rootScope.tracksIds.splice($rootScope.demotedTrackIndex, 1);
                        }
                        break;
                    case 'othertracks':
                        updateTracks($rootScope.demoteTrack);
                        break;


                }
                $rootScope.requestingPage = '';
                $rootScope.demotionStatus = 2;
            };
            var updateTracks = function(demotedTrack) {
                for (var index = 0; index < $rootScope.tracksIds.length; index++) {
                    var trackId = $rootScope.tracksIds[index];
                    if (trackId === demotedTrack.id) {
                        if ($rootScope.currentPage === 'tracks') {
                            //if current user track then simply update its isMyPromotion
                            if ($rootScope.isCurrentUserId(demotedTrack.ownerId)) {
                                if ($rootScope.tracks.length > index) {
                                    $rootScope.tracks[index].isMyPromotion = false;
                                    $rootScope.tracks[index].promoters = $rootScope.demoteTrack.promoters;
                                }
                            } else {//if other user track then remove it
                                if ($rootScope.tracks.length > index) {
                                    $rootScope.tracks.splice(index, 1);
                                }
                                $rootScope.tracksIds.splice(index, 1);
                            }

                        }
                    }
                }


            };

            var requstToInitiateDemotion = function() {
                totalPromotionsFound = 0;
                if (myPromotionIds !== undefined && myPromotionIds.length > 0) {
                    totalPromotionsFound = myPromotionIds.length;
                    angular.forEach(myPromotionIds, function(promotionId) {
                        initiateDemotion(promotionId);
                    });
                }
            };
            var successGetPromotion = function(data) {
                if (data.promotions !== undefined) {

                    if (data.promotions.length > 0) {
                        angular.forEach(data.promotions, function(promotion) {
                            if ($rootScope.isCurrentUserId(promotion.promoter_id)) {
                                myPromotionIds.push(promotion.id);
                            }
                        });
                    }
                }
                requstToInitiateDemotion();
            };
            var failureGetPromotion = function() {
                $rootScope.demomoteResult = 'fail';
                $rootScope.demotionStatus = 2;
            };

            CommonOperation.getPromotion({'audio_id': $rootScope.demoteTrack.id}, {}, successGetPromotion, failureGetPromotion);
        };

        $rootScope.alertMsg = {};
        $rootScope.showAlertMessage = function(msg) {
            $rootScope.alertMsg.message = msg;
            $('#alertMessageModal').modal('show');
        };

        $rootScope.backToProfile = function() {
            $('#promoteTrackModal').modal('hide');
            $('#demoteTrackModal').modal('hide');
//            $location.path('/home');
        };
        $rootScope.TRACK_LOAD_LIMIT = 4;
        $rootScope.DEFAULT = {
            TRACK_ALBUM: 'Default Album',
            TRACK_TITLE: 'Unknown Song',
            TRACK_ICON_URL: 'images/listn-now.png',
            TRACK_IMAGE_URL: 'images/cover-image.jpg'
        };
        $rootScope.CONSTANTS = {
            SONG_CREDIT_DURATION: 30, //in seconds
            CREDIT_USED_PER_SONG_PROMOTION: 5//in points
        };
        $rootScope.MESSAGES = {
            SONG_LISTENING_CREDIT_PAYMENT_FAILURE: 'Sorry ! Unable to pay you listening credits',
            //SONG_LISTENING_CREDIT_PAYMENT_SUCCESS: 'Congratulation ! you have earned'+$rootScope.currentSongEarnings+' credits for listening this song',
            SONG_LISTENING_CREDIT_PAYMENT_SUCCESS: 'Congratulation ! you have earned some credits for listening this song',
            UPDATE_CREDIT_FAILURE: 'Oops ! Unable to update you credits',
            NO_SONG_FOUND_TO_PLAY: 'No song selected to play',
            WAIT_PROCESSING_LAST_REQUEST: 'Please wait !\nProcessing your last request',
            CURRENT_SONG_DEMOTION_MSG: 'This song is currently playing, on demoting song will be removed from player.'
        };
        $rootScope.REGISTER_USER_SUCCESS = "User registered successfully";
        $rootScope.REGISTER_USER_FAILURE = "User could not be registered";
        $rootScope.REGISTER_USER_EXISTS = "User already registered";

        $rootScope.RETRIEVE_PROMOTERS_FAILED = "Promoters could not be retrieved";
        $rootScope.RETRIEVE_AUDIO_FAILURE = "Audios could not be retrieved";

        $rootScope.promoterList = [];

        $rootScope.showAllPromoters = function(promoters) {
            $rootScope.promoterList = promoters;
            $('#promotersModal').modal('show');
        };

        $rootScope.login = function() {

            $rootScope.pingServer();
            $rootScope.isLoggedIn = true;

            if ($rootScope.register) {
                $rootScope.register = false;
                $location.path('/registration');
            } else {
                $location.path('/home');
            }

        };

        $rootScope.logout = function() {

            var logoutURL = $rootScope.apipath + "/logout_handler";

            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", logoutComplete, false);
            xhr.open("GET", logoutURL);
            xhr.send();

            function logoutComplete(evt) {
                $rootScope.$apply(function() {
                    $rootScope.isLoggedIn = false;
                    $location.path('/');
                });
            }
        };

    }]);

promod.factory('CommonOperation', ['$resource', function($resource) {

        var serverURL = 'http://68.169.56.112';
        var restCommonService = $resource(
                serverURL + ':url/:id', {
                    url: '@url',
                    id: '@id'
                }, {
            getUser: {
                method: 'GET',
                url: serverURL + "/v1/user"
            },
            getProfileImage: {
                method: 'GET',
                url: serverURL + "/v1/image?image_type=profile"
            },
            getCoverImage: {
                method: 'GET',
                url: serverURL + "/v1/image?image_type=cover"
            },
            getIconImage: {
                method: 'GET',
                url: serverURL + "/v1/image?image_type=icon"
            },
            promoteAudio: {
                method: 'POST',
                url: serverURL + "/v1/promotion"
            },
            demoteAudio: {
                method: 'DELETE',
                url: serverURL + "/v1/promotion"
            },
            getPromotion: {
                method: 'GET',
                url: serverURL + "/v1/promotion"
            }
        });

        return restCommonService;

    }]);
