'use strict';

class OverviewController {

  constructor($stateParams, $http, $location, ModalService) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$location = $location;
    this.ModalService = ModalService;
    this.fetch();
  }

  fetch() {
    if (this.$stateParams.app) {
      this.$http
        .get('/api/apps/' + this.$stateParams.app)
        .then((response) => {
          this.app = response.data;
        })
      ;
    } else {
      this.$location.path('/apps');
    }
  }

  addConfig() {
    var config = {};
    config[this.key] = this.value;
    this.$http
      .patch('/api/apps/' + this.$stateParams.app + '/configs', config)
      .then(() => {
        this.key = this.value = null;
        this.fetch();
      })
    ;
  }

  editConfig(key, value) {
    this.ModalService
      .showModal({
        templateUrl: 'app/modals/edit-config/edit-config.html',
        controller: 'ModalEditConfigController',
        controllerAs: 'vm',
        inputs: {
          key: key,
          value: value
        }
      })
      .then((modal) => {
        modal.element.modal();
        modal.close.then((result) => {
          var config = {};
          config[result.key] = result.value;
          this.$http
            .patch('/api/apps/' + this.$stateParams.app + '/configs', config)
            .then(() => {
              this.key = this.value = null;
              this.fetch();
            })
          ;
        });
      })
    ;
  }

  deleteConfig(key, value) {
    this.ModalService
      .showModal({
        templateUrl: 'app/modals/delete-config/delete-config.html',
        controller: 'ModalDeleteConfigController',
        controllerAs: 'vm',
        inputs: {
          key: key,
          value: value
        }
      })
      .then((modal) => {
        modal.element.modal();
        modal.close.then((result) => {
          var config = {};
          config[result.key] = null;
          this.$http
            .patch('/api/apps/' + this.$stateParams.app + '/configs', config)
            .then(() => {
              this.key = this.value = null;
              this.fetch();
            })
          ;
        });
      })
    ;
  }

}

angular
  .module('dokkuUiApp')
  .controller('OverviewController', OverviewController)
;
