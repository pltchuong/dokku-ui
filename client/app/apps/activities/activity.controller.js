'use strict';

class ActivityController {

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
        .get('/api/apps/' + this.$stateParams.app + '/activities/' + this.$stateParams.activity, {
          silence: true
        })
        .then((response) => {
          this.activity = response.data;

          if (this.activity.status === 'running') {
            setTimeout(() => {
              this.fetch();
            }, 2000);
          }
        })
      ;
    } else {
      this.$location.path('/apps');
    }
  }
}

angular
  .module('dokkuUiApp')
  .controller('ActivityController', ActivityController)
;
