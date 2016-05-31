'use strict';

angular.module('dokkuUiApp')
  .config(function ($stateProvider, $httpProvider) {
    $stateProvider
      .state('app-overview', {
        url: '/apps/:app',
        templateUrl: 'app/apps/overview/overview.html',
        controller: 'OverviewController',
        controllerAs: 'vm'
      })
      .state('app-activities', {
        url: '/apps/:app/activities',
        templateUrl: 'app/apps/activities/activities.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm'
      })
      .state('app-access', {
        url: '/apps/:app/access',
        templateUrl: 'app/apps/access/access.html',
        controller: 'AccessController',
        controllerAs: 'vm'
      })
      .state('app-settings', {
        url: '/apps/:app/settings',
        templateUrl: 'app/apps/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm'
      })

      .state('404', {
        url: '/404',
        templateUrl: 'app/apps/errors/404.html'
      })
    ;

    $httpProvider.interceptors.push(function($q, $location) {
      return {
        responseError: function(rejection) {
          $location.path('/' + rejection.status);
          return $q.reject(rejection);
        }
      };
    });
  });
