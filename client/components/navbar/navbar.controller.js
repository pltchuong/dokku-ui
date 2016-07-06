'use strict';

class NavbarController {

  constructor($stateParams, $http, ModalService) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.ModalService = ModalService;
    this.fetch();
  }

  fetch() {
    this.$http
      .get('/api/apps')
      .then((response) => {
        this.apps = response.data;
      })
    ;
  }

  createApp() {
    this.ModalService
      .showModal({
        templateUrl: 'app/modals/create-app/create-app.html',
        controller: 'CreateAppConfigController',
        controllerAs: 'vm',
        inputs: {
          name: ''
        }
      })
      .then((modal) => {
        modal.element.modal();
        modal.close.then((result) => {
          this.$http
            .post('/api/apps', result)
            .then(() => {
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
  .controller('NavbarController', NavbarController)
;
