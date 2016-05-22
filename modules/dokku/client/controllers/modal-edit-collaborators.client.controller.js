'use strict';

angular.module('dokku').controller('ModalEditCollaboratorsController', ['$scope', 'collaborators', 'close', '$http', '$window',
  function ($scope, collaborators, close, $http, $window) {
    $scope.inputs = {
      collaborators: collaborators
    };

    $scope.fetch = function() {
      $http.get('/api/users').then(function(response) {
        $scope.users = response.data;
      });
    };

    $scope.close = function() {
      close({
        collaborators: $scope.inputs.collaborators
      }, 500);
    };

    $scope.$on('uiSelectSort:change', function(event, args) {
      console.log('uiSelectSort:change', args);
      $scope.inputs.collaborators = args.array;
      if (!$scope.$$phase) { //http://stackoverflow.com/questions/20263118/what-is-phase-in-angularjs
        $scope.$apply();
      }
    });

    $scope.fetch();
    setTimeout(function() {
      $window.dispatchEvent(new Event('resize'));
    }, 200);
  }
]);