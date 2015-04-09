'use strict';
/* Controller Module */

promodControllers.controller('MainController', ['$scope', '$rootScope', '$http', '$animate', '$location', 'UserService' ,'$timeout', function($scope, $rootScope, $http, $animate, $location, UserService, $timeout) {

        $scope.$on('$viewContentLoaded', function() {
        });

        $scope.user = {};

        $scope.isPassMatch = function(form) {

            form.confirmpassword.$setValidity("PasswordDidntMatch", true);
            if ($scope.user.confirmPassword !== undefined && $scope.user.confirmPassword !== null && $scope.user.confirmPassword !== '') {

                if (($scope.user.password !== $scope.user.confirmPassword)) {
                    form.confirmpassword.$setValidity("PasswordDidntMatch", false);
                } else {
                    form.confirmpassword.$setValidity("PasswordDidntMatch", true);
                }
            } else {
            }
        };

        $scope.openSignUpModel = function() {
            $rootScope.register = false;
            $scope.submitted = false;
            $scope.user = {};
            $scope.user.username = "";
            $scope.user.password = "";
            $scope.user.confirmPassword = "";
            $scope.userform.$setPristine();
            $('#signupModal').modal('show');
        };

        $scope.doRegister = function(userform) {
            $scope.submitted = true;
            if (userform.$valid) {
                $scope.registerUser();
            }
        };

        $scope.openLoginModel = function() {
            $scope.submitted = false;
            $scope.user = {};
            $scope.user.username = "";
            $scope.user.password = "";
            $scope.loginform.$setPristine();
            $('#loginModal').modal('show');
        };

        $scope.doLogin = function(loginform) {

            $scope.submitted = true;
            if (loginform.$valid) {
                $scope.loginProcess();
            }
        };

        $scope.loginProcess = function() {

            var loginURL = $rootScope.apipath + "/login_handler";

            var fd = new FormData();
            fd.append('login', $scope.user.username);
            fd.append('password', $scope.user.password);

            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", loginComplete, false);
            xhr.addEventListener("error", loginFailed, false);
            xhr.open("POST", loginURL);
            xhr.send(fd);

            function loginComplete(evt) {

                if (evt.currentTarget.responseURL.toString() === $rootScope.responseURL) {

                    $scope.user = {};
                    $scope.user.username = "";
                    $scope.user.password = "";
                    $scope.user.confirmPassword = "";

                    $('#signupModal').modal('hide');
                    $('#loginModal').modal('hide');

                    $rootScope.$apply(function() {
                        $timeout(function() {
                            $rootScope.login();
                        }, 500);
                    });

                } else {
                    $rootScope.$apply(function() {
                        var msg = "Invalid username or password";
                        var type = $rootScope.failure;
                        $rootScope.addMessage(msg, type);
                    });
                }
            }

            function loginFailed(evt) {
                alert("Login failed. Try again...");
            }
        };

        $scope.registerUser = function() {

            var success = function(data) {

                if (data.user !== undefined) {

                    $scope.submitted = false;
                    $scope.userform.$setPristine();
                    $rootScope.register = true;
                    $scope.loginProcess();


                } else {
                    var msg = $rootScope.REGISTER_USER_FAILURE;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                }
            };

            var failure = function() {

                $scope.submitted = false;
                $scope.user = {};
                $scope.user.username = "";
                $scope.user.password = "";
                $scope.user.confirmPassword = "";
                $scope.userform.$setPristine();

                var msg = $rootScope.REGISTER_USER_EXISTS;
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            };

            UserService.registerUser({'username': $scope.user.username, password: $scope.user.password}, {}, success, failure);
        };

        $scope.submit = function() {

            function success(data) {
                $scope.updateUser = data;
                alert("OKAY : " + JSON.stringify(data));
            }

            function failure(data) {
                alert("NOT OKAY : " + data);
            }
            $scope.users;

            //Retrieve Profile Data
            UserService.getUser(success, failure);

            //Retrieve User By Id
            UserService.getUser({id: '234382a2-c979-11e4-8fe8-00163e6c9cf9'}, {}, success, failure);

            //Register User
//            UserService.registerUser({'username': 'prem', password: '123'}, {}, success, failure);

            //Update User
//            UserService.updateUser({'first_name': 'Piyush', last_name: 'Sanghan', 'facebook_url': 'https://www.facebook.com/piyush.sanghani', 'image_url' : '/img/54d991e2-cd40-11e4-acc5-00163e6c9cf9.jpg'}, {}, success, failure);

        };





//        $rootScope.audioUrlList = [
//            {url: 'http://upload.wikimedia.org/wikipedia/en/5/5e/U2_One.ogg', displayName: 'my songs - One'},
////                {url: 'songs/song1.mp3', displayName: 'Pk - Tinga Tinga Dost'},
////                {url: 'songs/song2.mp3', displayName: 'Pk - love is waste of time'},
////                {url: 'songs/song1.mp3', displayName: 'Pk - Tinga Tinga Dost'},
////                {url: 'songs/song2.mp3', displayName: 'Pk - love is waste of time'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/6/6c/NirvanaSmellsLikeTeenSpirit.ogg', displayName: 'gautam - Smells Like Teen Spirit'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/b/be/My_Name_Is.ogg', displayName: 'gautam - My Name is'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/c/c4/Radiohead_-_Creep_%28sample%29.ogg', displayName: 'pop - Creep'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', displayName: 'pop - Live Forever'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/6/65/Eagles_-_Hotel_California.ogg', displayName: 'pop - Hotel California'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', displayName: 'Prabhat Fav - Stairway to Heaven'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Pink_floyd_another_brick_in_the_wall_part_2.ogg', displayName: 'Pink Lips - Another Brick in the Wall'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', displayName: 'Pink Lips - Come Together'},
//            {url: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', displayName: 'Indian & pop - Layla'}
//        ];
//
//        $rootScope.audioPlaylist = $rootScope.audioUrlList.map(function(song, index, array) {
//            var parseTitle = song.displayName.match(/(.*?)\s?-\s?(.*)?$/);
//            if (index >= 1 && index <= 4)
//                return {src: song.url, type: 'audio/mpeg', artist: parseTitle[1], title: parseTitle[2]};
//            return {src: song.url, type: 'audio/ogg', artist: parseTitle[1], title: parseTitle[2]};
//        });
//        $rootScope.setVolume = function(volume)
//        {
//            $rootScope.volumeValue = volume;
//            $rootScope.mediaPlayer.setVolume(volume / 100.0);
//        };
//        $rootScope.setProgress = function(seekPercentage)
//        {
//            $rootScope.progressValue = seekPercentage;
//            $rootScope.mediaPlayer.seek($rootScope.mediaPlayer.duration * (seekPercentage / 100.0));
//        };
//        $rootScope.volumeValue = 100;
//        $rootScope.x = {};
//        $rootScope.x.volumeValue1 = 100;
//        $rootScope.x.volumeOptions = {
//            from: 0,
//            to: 100,
//            step: 1,
//            //dimension: '%',
//            vertical: false,
//            smooth: true,
//            realtime: true,
//            css: {
//                background: {'background-color': 'silver'},
//                before: {'background-color': 'purple'},
//                default: {'background-color': 'silver'},
//                after: {'background-color': 'green'},
//                pointer: {'background-color': 'red'}
//            }
//        };
//        $rootScope.volumeOptions = {
//            from: 0,
//            to: 100,
//            step: 1,
//            //dimension: '%',
//            vertical: false,
//            smooth: true,
//            realtime: true,
//            css: {
//                background: {'background-color': 'silver'},
//                before: {'background-color': 'purple'},
//                default: {'background-color': 'silver'},
//                after: {'background-color': 'green'},
//                pointer: {'background-color': 'red'}
//            }
//        };
//        $rootScope.progressValue = 0;
//        $rootScope.progressOptions = {
//            from: 0,
//            to: 100,
//            step: 1,
//            dimension: '%',
//            vertical: false,
//            smooth: true,
//            realtime: true,
//            css: {
//                background: {'background-color': 'silver'},
//                before: {'background-color': 'purple'},
//                default: {'background-color': 'silver'},
//                after: {'background-color': 'purple'},
//                pointer: {'background-color': 'green'}
//            }
//        };
//        $rootScope.myconsole = console;
//
//        $rootScope.$watch(function() {
//            return $rootScope.mediaPlayer.currentTime;
//        }, function(newVal, oldVal) {
//            var progress = Math.round($rootScope.mediaPlayer.currentTime * 100 / $rootScope.mediaPlayer.duration);
//            if (progress > -1)
//                $rootScope.updateProgress(progress);
//        });
//        $rootScope.updateProgress = function(progress)
//        {
//            if (progress !== undefined)
//                $rootScope.progressValue = progress;
//        };
//        $scope.uploadAudio = function() {
//            var file = $scope.audioFile;
//            var audioUrl = $rootScope.apipath + 'v1/audio';
//
//            var fd = new FormData();
//            fd.append('audio_file', file);
//            $http.post(audioUrl, fd, {
//                transformRequest: angular.identity,
//                headers: {'Content-Type': undefined}
//            })
//                    .success(function(data) {
//                        $scope.audioResponse = data;
////                        alert("Success : " + JSON.stringify(data));
//                    })
//                    .error(function(data) {
////                        alert("Failure : " + JSON.stringify(data));
//                    });
//        };
//
//        $scope.uploadImage = function() {
//            var file = $scope.imageFile;
//            var imageUrl = $rootScope.apipath + 'v1/user_image';
//
//            var fd = new FormData();
//            fd.append('image_file', file);
//            $http.post(imageUrl, fd, {
//                transformRequest: angular.identity,
//                headers: {'Content-Type': undefined}
//            })
//                    .success(function(data) {
//                        $scope.imageResponse = data;
////                        alert("Success : " + JSON.stringify(data));
//                    })
//                    .error(function(data) {
////                        alert("Failure : " + JSON.stringify(data));
//                    });
//        };
//
//        $scope.uploadSong = function() {
//
//            var file = $scope.audioFile;
//            var audioUrl = $rootScope.apipath + 'v1/audio';
//
//            var fd = new FormData();
//            fd.append('audio_file', file);
//
//            var xhr = new XMLHttpRequest();
//            xhr.upload.addEventListener("progress", uploadProgress, false);
//            xhr.addEventListener("load", uploadComplete, false);
//            xhr.addEventListener("error", uploadFailed, false);
//            xhr.addEventListener("abort", uploadCanceled, false);
//            xhr.open("POST", audioUrl);
//            $scope.progressVisible = true;
//            xhr.send(fd);
//
//            function uploadComplete(evt) {
//                alert(evt.target.responseText);
//                $scope.$apply(function() {
//                    $scope.progressVisible = false;
//                    console.log(evt.target.responseText);
//                    if (evt.target.responseText.msg) {
//                        $scope.audioResponse = evt.target.responseText;
//                        var msg = "Upload successfully completed";
//                        var type = $rootScope.success;
//                        $rootScope.addMessage(msg, type);
//                    } else {
//                        var msg = "Upload could not be completed";
//                        var type = $rootScope.failure;
//                        $rootScope.addMessage(msg, type);
//                    }
//                });
//            }
//
//            function uploadProgress(evt) {
//                $scope.$apply(function() {
//                    if (evt.lengthComputable) {
//                        $scope.progress = Math.round(evt.loaded * 100 / evt.total);
//                    } else {
//                        $scope.progress = 'Unable to compute progress';
//                    }
//                });
//            }
//
//            function uploadFailed(evt) {
//                alert("There was an error attempting to upload the file.");
//            }
//
//            function uploadCanceled(evt) {
//                $scope.$apply(function() {
//                    $scope.progressVisible = false;
//                });
//                alert("The upload has been canceled by the user or the browser dropped the connection.");
//            }
//        };
//
//        $scope.uploadProfile = function() {
//
//            var file = $scope.imageFile;
//            var imageUrl = $rootScope.apipath + 'v1/user_image';
//
//            file.filename = "Test";
//            var fd = new FormData();
//            fd.append('image_file', file);
//
//            var xhr = new XMLHttpRequest();
//            xhr.upload.addEventListener("progress", uploadProgress, false);
//            xhr.addEventListener("load", uploadComplete, false);
//            xhr.addEventListener("error", uploadFailed, false);
//            xhr.addEventListener("abort", uploadCanceled, false);
//            xhr.open("POST", imageUrl);
//            $scope.progressVisible = true;
//            xhr.send(fd);
//
//            function uploadComplete(evt) {
//                alert(evt.target.responseText);
//                $scope.$apply(function() {
//                    $scope.progressVisible = false;
//                    var jsonResponse = JSON.parse(evt.target.responseText);
//                    if (jsonResponse.user_image !== undefined) {
//                        $scope.imageResponse = jsonResponse;
//                        var msg = "Upload successfully completed";
//                        var type = $rootScope.success;
//                        $rootScope.addMessage(msg, type);
//                    } else {
//                        var msg = "Upload could not be completed";
//                        var type = $rootScope.failure;
//                        $rootScope.addMessage(msg, type);
//                    }
//                });
//            }
//
//            function uploadProgress(evt) {
//                $scope.$apply(function() {
//                    if (evt.lengthComputable) {
//                        $scope.progress = Math.round(evt.loaded * 100 / evt.total);
//                    } else {
//                        $scope.progress = 'Unable to compute progress';
//                    }
//                });
//            }
//
//            function uploadFailed(evt) {
//                alert("There was an error attempting to upload the file.");
//            }
//
//            function uploadCanceled(evt) {
//                $scope.$apply(function() {
//                    $scope.progressVisible = false;
//                });
//                alert("The upload has been canceled by the user or the browser dropped the connection.");
//            }
//        };
//
//        $rootScope.seek = function($event) {
//
//            var percentage = ($event.offsetX / $event.target.offsetWidth);
//            var seekPercentage = 0;
//            if (percentage <= 1) {
//                seekPercentage = percentage;
//            }
//            $rootScope.mediaPlayer.seek($rootScope.mediaPlayer.duration * seekPercentage);
//        };

    }
]);
