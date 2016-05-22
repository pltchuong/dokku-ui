'use strict';

angular.module('dokku').controller('AppOverviewController', ['$scope', '$rootScope', '$stateParams', '$http', '$location', 'ModalService', 
  function ($scope, $rootScope, $stateParams, $http, $location, ModalService) {
    if($stateParams.app) {
      $http.get('/api/apps/' + $stateParams.app).then(function(response) {
        $rootScope.app = response.data;
      });
    } else {
      $location.path('/apps');
    }

    $scope.editConfig = function(key, value) {
      ModalService.showModal({
        templateUrl: 'modules/dokku/client/views/modal-edit-config.client.view.html',
        controller: 'ModalEditConfigController',
        inputs: {
          key: key,
          value: value
        }
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          console.log(result);
        });
      });
    };

    $scope.deleteConfig = function(key, value) {
      ModalService.showModal({
        templateUrl: 'modules/dokku/client/views/modal-delete-config.client.view.html',
        controller: 'ModalDeleteConfigController',
        inputs: {
          key: key,
          value: value
        }
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          console.log(result);
        });
      });
    };
  }
]);