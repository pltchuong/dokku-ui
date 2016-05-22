(function () {
  'use strict';

  //Setting up route
  angular
    .module('dokku')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Dokku state routing
    $stateProvider
      .state('apps', {
        url: '/apps',
        templateUrl: 'modules/dokku/client/views/apps.client.view.html'
      })
      .state('app-overview', {
        url: '/apps/:app',
        templateUrl: 'modules/dokku/client/views/app-overview.client.view.html'
      })
      .state('app-builds', {
        url: '/apps/:app/builds',
        templateUrl: 'modules/dokku/client/views/app-builds.client.view.html'
      })
      .state('app-access', {
        url: '/apps/:app/access',
        templateUrl: 'modules/dokku/client/views/app-access.client.view.html'
      })
      .state('app-settings', {
        url: '/apps/:app/settings',
        templateUrl: 'modules/dokku/client/views/app-settings.client.view.html'
      });
  }
})();
