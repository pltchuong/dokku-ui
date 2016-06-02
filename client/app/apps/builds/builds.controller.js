'use strict';

class BuildsController {

  constructor($stateParams, $http, $location, ModalService) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$location = $location;
    this.ModalService = ModalService;
    this.fetch();
  }

  fetch() {
    if(this.$stateParams.app) {
      this.$http.get('/api/activities/' + this.$stateParams.build).then(response => {
        this.activity = response.data;

        setTimeout(() => {
          this.fetch();
        }, 2000);
      });
    } else {
      this.$location.path('/apps');
    }
  }
}

angular.module('dokkuUiApp')
  .controller('BuildsController', BuildsController);
