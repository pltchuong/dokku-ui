'use strict';

angular.module('dokkuUiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('activities', {
        url: '/activities',
        templateUrl: 'app/tools/activities/activities.html',
        controller: 'AllActivitiesController',
        controllerAs: 'vm'
      });
  });
