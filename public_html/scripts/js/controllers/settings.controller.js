
promodControllers.controller('SettingsController', ['$scope', '$rootScope', '$http', 'UserService', 'UserImageService', function($scope, $rootScope, $http, UserService, UserImageService) {

        $rootScope.serverDate = new Date();
        $scope.userFlags = {'invalidProfileImageFileFlag': true, 'invalidCoverImageFileFlag': true, 'passwordMismatchFlag': false};

        $scope.$on('$viewContentLoaded', function() {
            $scope.retrieveUserDetail();
            $scope.retrieveCoverImage();
        });
        
        $rootScope.clearAlertMessages();

        $scope.retrieveUserDetail = function() {

            $scope.userData = {};

            function success(data) {
                $scope.userData.name = data.user.first_name + " " + data.user.last_name;                
            }

            function failure(data) {
            }

            UserService.getUser(success, failure);
        };
        
        $scope.retrieveCoverImage = function() {
            function success(data) {    
                if(data.user_images[0]!==undefined){
                var coverImage=data.user_images[0].image_url;
                if(coverImage!==undefined && coverImage!==null)
                    $scope.coverImageFullName = coverImage;
                else
                    $scope.coverImageFullName = '';
                }
            }

            function failure(data) {                
            }

            UserImageService.getCoverImage(success, failure);
        };

        $scope.initialize = function() {

            $scope.userData = {};
            $scope.confirmPassword = '';
            $scope.coverImageFullName = '';
            $scope.userFlags = {'invalidProfileImageFileFlag': true, 'invalidCoverImageFileFlag': true, 'passwordMismatchFlag': false};
            $scope.submitted = false;
        };

        $scope.test = function() {
            //var date = $.datepicker.formatDate('M d, yy', new Date($scope.session.birthDate));
            var date = $.datepicker.formatDate('M d, yy', new Date($scope.session.birthDate));
            $scope.birthDate = date;
        };
        
        $scope.validateName=function(settingsform){
            if($scope.userData.name===undefined || $scope.userData.name===''){
                settingsform.fname.$error.invalidName=false;
                return;
            }
            
            var nameSplits=$scope.userData.name.trim().split(" ");
            if(nameSplits.length>2){                
                settingsform.fname.$error.invalidName=true;
                
            }else{
                settingsform.fname.$error.invalidName=false;
            }
//            console.log("splits="+nameSplits);
//            console.log("splits len="+nameSplits.length);
        };
        
        $scope.matchPasswords = function() {

            if ($scope.userData.password !== undefined && $scope.confirmPassword !== undefined && $scope.userData.password !== $scope.confirmPassword) {

                $scope.userFlags.passwordMismatchFlag = true;
            } else {
                $scope.userFlags.passwordMismatchFlag = false;
            }
        };

        $scope.saveChanges = function(settingsform) {

            $scope.submitted = true;
            
            if(settingsform.fname.$error.invalidName)
                return;
            
            if ($scope.userData.password !== $scope.confirmPassword) {

                $scope.userFlags.passwordMismatchFlag = true;
                return;
                
            } else {
                $scope.userFlags.passwordMismatchFlag = false;
            }

            if (settingsform.$valid) {

                //code to save changes
                if ($scope.userFlags.invalidProfileImageFileFlag === false) {
                    $scope.uploadProfileImage($scope.profileImageFile);
                }

                if ($scope.userFlags.invalidCoverImageFileFlag === false) {
                    $scope.uploadCoverImage($scope.coverImageFile);
                }

                $scope.updateUserInfo($scope.userData);

                
            }
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
                    $scope.userFlags.invalidProfileImageFileFlag = true;

                } else {
                    $scope.userFlags.invalidProfileImageFileFlag = false;
                    $scope.closeLastAlertMessage();
                }

            } else {
                $scope.userFlags.invalidProfileImageFileFlag = true;
            }
        };

        $scope.coverImageChanged = function(fileFullPath) {

            if (fileFullPath !== undefined && fileFullPath !== '') {

                var fileFullName = fileFullPath.split(/(\\|\/)/g).pop();
                var fileExtension = fileFullName.substring(fileFullName.lastIndexOf('.'));
                var fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));

                if (!$scope.hasExtension(fileExtension, ['.jpg', '.JPG', '.png', '.PNG', '.gif', '.GIF'])) {
                    var msg = "Unsupported image format " + fileExtension;
                    var type = $rootScope.failure;
                    $rootScope.addMessage(msg, type);
                    $scope.userFlags.invalidCoverImageFileFlag = true;
                    $scope.coverImageFullName = '';

                } else {
                    $scope.userFlags.invalidCoverImageFileFlag = false;
                    $scope.coverImageFullName = fileFullName;
                    $scope.closeLastAlertMessage();
                }

            } else {
                $scope.userFlags.invalidCoverImageFileFlag = true;
                $scope.coverImageFullName = '';
            }
        };

        $scope.hasExtension = function(extension, extensionList) {
            if (extension === undefined || extension === '')
                return false;
            return extensionList.indexOf(extension) > -1;
        };

        $scope.closeLastAlertMessage = function() {
            if ($rootScope.validations !== undefined && $rootScope.validations.length > 0) {
                $rootScope.closeAlertMessage($rootScope.validations.length - 1);
            }
        };




        $scope.updateUserInfo = function(user) {

            function success(data) {
                var msg = "Profile information update successfully completed";
                var type = $rootScope.success;
                $rootScope.addMessage(msg, type, true);
            }

            function failure(data) {
                var msg = "Profile update could not be completed";
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type, true);
            }
            
            var firstName=' ';
            var lastName=' ';
            var nameSplits=user.name.trim().split(" ");
            
            if(nameSplits.length>1){                
                firstName=nameSplits[0];
                lastName=nameSplits[1];
                
            }else{
                firstName=nameSplits[0];
            }
            
            UserService.updateUser({'first_name': firstName, last_name: lastName}, {}, success, failure);
            //UserService.updateUser({image_url:'http://68.169.56.112/img/347f8116-d11b-11e4-bde1-00163e6c9cf9.jpg'}, {}, success, failure);

        };

        $scope.uploadProfileImage = function(imageFile) {

            if (imageFile === undefined) {
                var msg = "Profile image upload could not be completed : no file";
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type, true);
                return;
            }

            var file = imageFile;
            var imageUrl = $rootScope.apipath + '/v1/image';

            file.filename = "Test";
            var fd = new FormData();
            fd.append('image_file', file);            
            fd.append('image_type', 'profile');

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", imageUrl);
            xhr.send(fd);

            function uploadComplete(evt) {

                $scope.$apply(function() {

                    $scope.progressVisible = false;
                    if (evt.target.status === 200) {
                        var jsonResponse = JSON.parse(evt.target.response);
                        var msg = "Profile image upload successfully completed";
                        var type = $rootScope.success;
                        $rootScope.addMessage(msg, type, true);
                        //load new profile image
                        $rootScope.getProfileImage();

                    } else {
                        var msg = "Profile image upload could not be completed";
                        var type = $rootScope.failure;
                        $rootScope.addMessage(msg, type, true);
                    }
                });
            }

            function uploadProgress(evt) {

            }

            function uploadFailed(evt) {
                var msg = "Profile image upload could not be completed";
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type, true);
            }

            function uploadCanceled(evt) {
                $scope.$apply(function() {

                });
                alert("The upload has been canceled by the user or the browser dropped the connection.");
            }
        };

        $scope.uploadCoverImage = function(imageFile) {

            if (imageFile === undefined) {
                var msg = "Cover image upload could not be completed : no file";
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type, true);
                return;
            }
            var file = imageFile;
            var imageUrl = $rootScope.apipath + '/v1/image';

            file.filename = "Test";
            var fd = new FormData();
            fd.append('image_file', file);
            fd.append('image_type', 'cover');

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", imageUrl);
            xhr.send(fd);

            function uploadComplete(evt) {

                $scope.$apply(function() {

                    $scope.progressVisible = false;
                    if (evt.target.status === 200) {

                        var jsonResponse = JSON.parse(evt.target.response);
                        var msg = "Cover image upload successfully completed";
                        var type = $rootScope.success;
                        $rootScope.addMessage(msg, type, true);
                        $rootScope.getCoverImage();

                    } else {
                        var msg = "Cover image upload could not be completed";
                        var type = $rootScope.failure;
                        $rootScope.addMessage(msg, type, true);
                    }
                });
            }

            function uploadProgress(evt) {

            }

            function uploadFailed(evt) {

                var msg = "Cover image upload could not be completed";
                var type = $rootScope.failure;
                $rootScope.addMessage(msg, type, true);
            }

            function uploadCanceled(evt) {
                $scope.$apply(function() {

                });
                alert("The upload has been canceled by the user or the browser dropped the connection.");
            }
        };

    }]);


















