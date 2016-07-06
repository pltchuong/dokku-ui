'use strict';

angular
  .module('dokkuUiApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('apps', {
        url: '',
        templateUrl: 'app/apps/apps.html',
        abstract: true,
        authenticate: true
      })
      .state('apps.index', {
        url: '/apps',
        templateUrl: 'app/apps/index.html',
        authenticate: true
      })
      .state('apps.overview', {
        url: '/apps/:app',
        templateUrl: 'app/apps/overview/overview.html',
        controller: 'OverviewController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('apps.activities', {
        url: '/apps/:app/activities',
        templateUrl: 'app/apps/activities/activities.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('apps.activity', {
        url: '/apps/:app/activities/:activity',
        templateUrl: 'app/apps/activities/activity.html',
        controller: 'ActivityController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('apps.access', {
        url: '/apps/:app/access',
        templateUrl: 'app/apps/access/access.html',
        controller: 'AccessController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('apps.settings', {
        url: '/apps/:app/settings',
        templateUrl: 'app/apps/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      })
    ;
  })
;
