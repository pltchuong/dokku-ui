'use strict';

angular.module('dokku').controller('ModalCreateAppController', ['$scope', 'key', 'value', 'close',
  function ($scope, key, value, close) {
    $scope.key = key;
    $scope.value = value;

    $scope.close = function() {
      close({
        key: $scope.key,
        value: $scope.value
      }, 500);
    };
  }
]);