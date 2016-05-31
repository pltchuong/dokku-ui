'use strict';

class NavbarController {

  constructor($state, $http, $scope, $rootScope) {
    $http.get('/api/apps').then(response => {
      $scope.current_app = $state.params.app;
      $scope.apps = response.data;
    });
    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
      $scope.current_app = toParams.app;
    });
  }
}

angular.module('dokkuUiApp')
  .controller('NavbarController', NavbarController);
