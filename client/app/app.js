'use strict';

angular.module('dokkuUiApp', ['dokkuUiApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'angularModalService', 'ui.select', 'angularMoment'])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true);
  });
