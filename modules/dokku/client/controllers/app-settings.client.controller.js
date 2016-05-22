'use strict';

angular.module('dokku').controller('AppSettingsController', ['$scope', '$rootScope', '$stateParams', '$http',
  function ($scope, $rootScope, $stateParams, $http) {
    $http.get('/api/apps/' + $stateParams.app).then(function(response) {
      $rootScope.app = response.data;
    });
  }
]);