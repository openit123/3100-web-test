// This fragment of codes referenced the materials in an online course on udemy that I participated in:
// https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/overview

(function($){
  $.deparam = $.deparam || function(uri){
    if(uri === undefined){
      uri = window.location.search;
    }
    var queryString = {};
    uri.replace(
      new RegExp(
        "([^?=&]+)(=([^&#]*))?", "g"),
        function($0, $1, $2, $3) {
        	queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
        }
      );
      return queryString;
    };
})(jQuery);
