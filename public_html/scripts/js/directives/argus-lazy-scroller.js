/**
 * This angularJS directive helps in performing some task when page scrolled to bottom
 * 
 * @package argus.lazyScroller
 * @copyright 2015 Argusoft India Ltd.
 * 
 * @author prabhat
 */
/*Example:- 
 * <div argus-page-scrolled="loadMoreTracks()"> 
 * 
 *              will invoke loadMoreTracks() when u scroll page to end
 * 
 * 
 * important methods:
 *             
 *       
 * important properties:
 *            
 *       
 *       
 * 
 */
angular.module('lazyScroller', []).directive('argusPageScrolled', function() {
    return function(scope, elm, attr) {
        var element = elm[0];
        var checkBounds = function(evt) {            
            if (document.body.scrollHeight - $(this).scrollTop()-120 <= $(this).height()){                
                scope.$apply(attr.argusPageScrolled);
            }
        };          
        //angular.element(window).bind('scroll load', checkBounds);//will check when pageLoaded or pageScrolled
        angular.element(window).bind('scroll', checkBounds);//check only when pageScrolled
        
    };
});