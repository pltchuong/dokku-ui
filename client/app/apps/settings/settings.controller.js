'use strict';

class SettingsController {

  constructor($stateParams, $http, $location) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$location = $location;
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
}

angular
  .module('dokkuUiApp')
  .controller('SettingsController', SettingsController)
;
