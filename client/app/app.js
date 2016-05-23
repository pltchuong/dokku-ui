'use strict';

angular.module('dokkuUiApp', ['dokkuUiApp.constants', 'ngCookies', 'ngResource', 'ngSanitize',
    'btford.socket-io', 'ui.router'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
