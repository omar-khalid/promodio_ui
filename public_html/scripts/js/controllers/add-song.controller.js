promodControllers.controller('AddSongController', ['$scope', '$rootScope', '$http', 'AudioService', function($scope, $rootScope, $http, AudioService) {

        $scope.$on('$viewContentLoaded', function() {
//            $rootScope.scrollFunc('top');
        });

        $scope.audioFlags = {'invalidImageFileFlag': true, 'invalidAudioFileFlag': true};

        $scope.initialize = function() {

            $scope.audioFlags = {'invalidImageFileFlag': true, 'invalidAudioFileFlag': true};
            $scope.songName = "";
            $scope.selectedSongFullName = '';
            $scope.agreeConditions = false;
            $scope.agreeCondition = false;
            $scope.submitted = false;
        };
          
        $scope.showTermsAndNConditions=function(){
            if($scope.progressVisible){
                alert($rootScope.MESSAGES.WAIT_PROCESSING_LAST_REQUEST);
                return;
            }
            //$('#termsAndConditionsModal').modal('show');
            $scope.upload();
        };
        
        $scope.termsAndConditionsChanged = function (agree) {
            $scope.agreeConditions = false;
            if (agree) {
                $('#termsAndConditionsModal').modal('show');
            } else {
                $('#termsAndConditionsModal').modal('hide');
            }
        };
        
        $scope.acceptAllConditions=function(){            
            $('#termsAndConditionsModal').modal('hide');            
            $scope.agreeConditions = true; 
            $scope.agreeCondition = true;  
            //$scope.upload();
        };
        
        $scope.disagreeConditions=function(){
            $('#termsAndConditionsModal').modal('hide');            
            $scope.agreeConditions = false;
            $scope.agreeCondition = false;  
        };

        $scope.profileImageChanged = function(fileFullPath) {

            if (fileFullPath !== undefined && fileFullPath !== '') {

                var fileFullName = fileFullPath.split(/(\\|\/)/g).pop();
                var fileExtension = fileFullName.substring(fileFullName.lastIndexOf('.'));
                var fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));

                if (!$scope.hasExtension(fileExtension, ['.jpg', '.JPG', '.png', '.PNG', '.gif', '.GIF'])) {
                    var msg = "Unsupported image format " + fileExtension;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                    $scope.audioFlags.invalidImageFileFlag = true;

                } else {
                    $scope.audioFlags.invalidImageFileFlag = false;
                    $scope.closeLastAlertMessage();
                }

            } else {
                $scope.audioFlags.invalidImageFileFlag = true;
            }
        };

        $scope.songChanged = function(fileFullPath) {

            if (fileFullPath !== undefined && fileFullPath !== '') {

                var fileFullName = fileFullPath.split(/(\\|\/)/g).pop();
                var fileExtension = fileFullName.substring(fileFullName.lastIndexOf('.'));
                var fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));

                if (!$scope.hasExtension(fileExtension, ['.mp3', '.MP3'])) {

                    $scope.songName = "";
                    $scope.selectedSongFullName = "";
                    var msg = "Unsupported audio format " + fileExtension;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                    $scope.audioFlags.invalidAudioFileFlag = true;
                }
                else
                {
                    $scope.songName = fileName;
                    $scope.selectedSongFullName = fileFullName;
                    $scope.audioFlags.invalidAudioFileFlag = false;
                    $scope.closeLastAlertMessage();
                }
            }
            else
            {
                $scope.audioFlags.invalidAudioFileFlag = true;
                $scope.songName = "";
                $scope.selectedSongFullName = "";
            }
        };

        $scope.hasExtension = function(extension, extensionList) {
            if (extension === undefined || extension === '')
                return false;
            return extensionList.indexOf(extension) > -1;
        };

        $scope.cancel = function() {
            $scope.initialize();
        };

        $scope.upload = function() {

            $scope.submitted = true;
            if ($scope.audioFlags.invalidAudioFileFlag === true) {

                var msg = "No song selected to upload";
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
                return;
            }
            if ($scope.songName === undefined || $scope.songName.trim() === '') {
                return;
            }

            $scope.closeLastAlertMessage();
            $scope.uploadSong();//upload selected song
            if ($scope.audioFlags.invalidImageFileFlag !== true) {
                $scope.uploadProfile();//upload if any image selected
            }
        };

        $scope.uploadSong = function() {

            var file = $scope.audioFile;
            var audioUrl = $rootScope.apipath + '/v1/audio';

            var fd = new FormData();
            fd.append('audio_file', file);

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", audioUrl);
            $scope.progress = 0;
            $scope.progressVisible = true;
            xhr.send(fd);

            function uploadComplete(evt) {

                $scope.$apply(function() {

                    $scope.progressVisible = false;
                    if (evt.target.status === 200) {
                        var jsonResponse = JSON.parse(evt.target.response);
                        $scope.audioResponse = jsonResponse.msg;
                        var msg = "Upload successfully completed";
                        var type = $rootScope.success;
                        $rootScope.addMessage(msg, type);
                    } else {
                        var msg = "Upload could not be completed";
                        var type = $rootScope.failure;
                        $rootScope.addMessage(msg, type);
                    }
                    $scope.initialize();
                });
            }

            function uploadProgress(evt) {
                $scope.$apply(function() {
                    if (evt.lengthComputable) {
                        $scope.progress = Math.round(evt.loaded * 100 / evt.total);
                    } else {
                        $scope.progress = 'Unable to compute progress';
                    }
                });
            }

            function uploadFailed(evt) {
                $scope.progressVisible = false;
                var msg = "Upload could not be completed";
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type);
            }

            function uploadCanceled(evt) {
                $scope.$apply(function() {
                    $scope.progressVisible = false;
                });
                alert("The upload has been canceled by the user or the browser dropped the connection.");
            }
        };

        $scope.uploadProfile = function() {

            var file = $scope.imageFile;
            var imageUrl = $rootScope.apipath + '/v1/image';

            file.filename = "Test";
            var fd = new FormData();
            fd.append('image_file', file);
            fd.append('image_type', 'icon');
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", imageUrl);
//            $scope.progressVisible = true;
            xhr.send(fd);

            function uploadComplete(evt) {
//                console.log(evt.target.responseText);
                $scope.$apply(function() {
//                    $scope.progressVisible = false;
                    if (evt.target.status === 200) {
                        var jsonResponse = JSON.parse(evt.target.response);
//                        $scope.imageResponse = jsonResponse;
//                        var msg = "Upload successfully completed";
//                        var type = $rootScope.success;
//                        $rootScope.addMessage(msg, type);
                          $rootScope.getIconImage();
                    } else {
//                        var msg = "Upload could not be completed";
//                        var type = $rootScope.failure;
//                        $rootScope.addMessage(msg, type);
                    }
                });
            }

            function uploadProgress(evt) {
//                $scope.$apply(function () {
//                    if (evt.lengthComputable) {
//                        $scope.progress = Math.round(evt.loaded * 100 / evt.total);
//                    } else {
//                        $scope.progress = 'Unable to compute progress';
//                    }
//                });
            }

            function uploadFailed(evt) {
//                alert("There was an error attempting to upload the file.");
            }

            function uploadCanceled(evt) {
                $scope.$apply(function() {
//                    $scope.progressVisible = false;
                });
                alert("The upload has been canceled by the user or the browser dropped the connection.");
            }
        };

        $scope.closeLastAlertMessage = function() {

            if ($rootScope.validations !== undefined && $rootScope.validations.length > 0) {

                $rootScope.closeAlertMessage($rootScope.validations.length - 1);
            }
        };
    }]);
