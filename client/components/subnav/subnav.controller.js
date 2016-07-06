'use strict';

class SubnavController {

  constructor($state, $stateParams, Auth) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Auth = Auth;
  }

  logout() {
    this.Auth.logout();
    this.$state.go('index');
  }
}

angular
  .module('dokkuUiApp')
  .controller('SubnavController', SubnavController)
;
