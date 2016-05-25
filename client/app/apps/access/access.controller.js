'use strict';

class AccessController {

  constructor($rootScope, $stateParams, $http, $location, ModalService) {
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$location = $location;
    this.ModalService = ModalService;
    this.fetch();
  }

  fetch() {
    if(this.$stateParams.app) {
      this.$http.get('/api/apps/' + this.$stateParams.app).then(response => {
        this.$rootScope.app = response.data;
      });
    } else {
      this.$location.path('/apps');
    }
  }

  addCollaborator(app) {
    this.ModalService.showModal({
      templateUrl: 'app/modals/edit-collaborators/edit-collaborators.html',
      controller: 'ModalEditCollaboratorsController',
      controllerAs: 'vm',
      inputs: {
        collaborators: app.collaborators
      }
    }).then(modal => {
      modal.element.modal();
      modal.close.then(result => {
        app.collaborators = result.collaborators.map(user => {
          return user._id;
        });
        this.$http.put('/api/apps/' + app.name, app).then(response => {
          this.fetch();
        });
      });
    });
  }
}

angular.module('dokkuUiApp')
  .controller('AccessController', AccessController);
