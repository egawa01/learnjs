'use strict';
var learnjs = {};



learnjs.problemView = function() {
    return $('<div class="problem-view">').text('Coming soon!');
 }

 learnjs.problemView = function(problemNumber) {
     var view = $('.templates .problem-view').clone();
     view.find('.title').text('Problem #' + problemNumber + ' Coming soon!');
     return view;
};

learnjs.showView = function(hash) {
    var routes = {
        '#problem': learnjs.problemView
    };
    var hashParts = hash.split('-');
    var viewFn = routes[hashParts[0]];
    if(viewFn) {
        $('.view-container').empty().append(viewFn(hashParts[1]));
    };
 };

 learnjs.appOnReady = function() {
    window.onhashchange = function() {
        learnjs.showView(window.location.hash);
    };
     learnjs.showView(window.location.hash);
 };

 learnjs.applyObject = function(obj, elem) {
     for (var key in obj) {
         elem.find('[data-name="' + key + '"]').text(obj[key]);
     }
 }

