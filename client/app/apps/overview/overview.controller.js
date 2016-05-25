'use strict';

class OverviewController {

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

  editConfig(key, value) {
    this.ModalService.showModal({
      templateUrl: 'app/modals/edit-config/edit-config.html',
      controller: 'ModalEditConfigController',
      controllerAs: 'vm',
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

  deleteConfig(key, value) {
    this.ModalService.showModal({
      templateUrl: 'app/modals/delete-config/delete-config.html',
      controller: 'ModalDeleteConfigController',
      controllerAs: 'vm',
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

angular.module('dokkuUiApp')
  .controller('OverviewController', OverviewController);
