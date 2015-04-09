# promodio_ui
Promodio UI

For actual deployment you need to do the following changes.

* $rootScope.apipath & serverURL must be set to the URL of the api server
  
  e.g. : $rootScope.apipath = "http://68.169.56.112";
         var serverURL = 'http://68.169.56.112';

* $rootScope.responseURL has been used to see whether the username and password are valid or not at the time of login
  
  e.g. : $rootScope.responseURL = "http://68.169.56.112/test/show";


