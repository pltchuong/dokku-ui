'use strict';

angular.module('dokku').controller('HeaderController', ['$scope', '$rootScope', '$http', '$stateParams',
  function ($scope, $rootScope, $http, $stateParams) {
    $http.get('/api/apps').then(function(response) {
      $scope.apps = response.data;
    });
  }
]);
