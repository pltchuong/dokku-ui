'use strict';

class NavbarController {

  constructor($http, $scope) {
    $http.get('/api/apps').then(function(response) {
      $scope.apps = response.data;
    });
  }
}

angular.module('dokkuUiApp')
  .controller('NavbarController', NavbarController);
