'use strict';

angular.module('dokku').controller('AppAccessController', ['$scope', '$rootScope', '$stateParams', '$http', 'ModalService',
  function ($scope, $rootScope, $stateParams, $http, ModalService) {
    $scope.fetch = function() {
      $http.get('/api/apps/' + $stateParams.app).then(function(response) {
        $rootScope.app = response.data;
      });
    };

    $scope.addCollaborator = function(app) {
      ModalService.showModal({
        templateUrl: 'modules/dokku/client/views/modal-edit-collaborators.client.view.html',
        controller: 'ModalEditCollaboratorsController',
        inputs: {
          collaborators: app.collaborators
        }
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          app.collaborators = result.collaborators.map(function(user) {
            return user._id;
          });
          $http.put('/api/apps/' + $stateParams.app, app).then(function(response) {
            $scope.fetch();
          });
        });
      });
    };
    
    $scope.fetch();
  }
]);