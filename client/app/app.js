'use strict';

angular
  .module('dokkuUiApp', ['dokkuUiApp.auth', 'dokkuUiApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'ui.bootstrap', 'validation.match', 'angularModalService', 'ui.select', 'angularMoment', 'm43nu.auto-height', 'luegg.directives'])
  .config(($httpProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) => {
    $httpProvider.interceptors.push(($q) => {
      return {
        request(config) {
          if (!config.silence) {
            jQuery('.loading')
              .stop()
              .fadeIn()
            ;
          }
          return config;
        },

        requestError(rejection) {
          jQuery('.loading')
            .stop()
            .fadeOut()
          ;
          return $q.reject(rejection);
        },

        response(response) {
          jQuery('.loading')
            .stop()
            .fadeOut()
          ;
          return response;
        },

        responseError(rejection) {
          jQuery('.loading')
            .stop()
            .fadeOut()
          ;
          return $q.reject(rejection);
        }
      };
    });

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true);

    $urlMatcherFactoryProvider.strictMode(false);
  })
  .run(['$rootScope', ($rootScope) => {
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
      $rootScope.state = toState.name;
    });
  }]);
