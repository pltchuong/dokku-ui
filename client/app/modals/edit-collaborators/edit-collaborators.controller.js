'use strict';

class ModalEditCollaboratorsController {

  constructor(close, $http, collaborators) {
    this.exit = close;
    this.$http = $http;
    this.inputs = {
      collaborators: collaborators
    };
    this.fetch();
  }

  fetch() {
    this.$http
      .get('/api/users')
      .then((response) => {
        this.inputs.users = response.data;
      })
    ;
  }

  close() {
    this.exit({
      collaborators: this.inputs.collaborators
    }, 500);
  }

}

angular
  .module('dokkuUiApp')
  .controller('ModalEditCollaboratorsController', ModalEditCollaboratorsController)
;
