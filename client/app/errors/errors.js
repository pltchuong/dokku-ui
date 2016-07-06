'use strict';

angular
  .module('dokkuUiApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('404', {
        templateUrl: 'app/errors/404/404.html'
      })
      .state('500', {
        templateUrl: 'app/errors/500/500.html'
      })
    ;
  })
;
