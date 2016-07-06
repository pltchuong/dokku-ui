'use strict';

class ModalEditConfigController {

  constructor(close, key, value) {
    this.exit = close;
    this.inputs = {
      key: key,
      value: value
    };
  }

  close() {
    this.exit({
      key: this.inputs.key,
      value: this.inputs.value
    }, 500);
  }

}

angular
  .module('dokkuUiApp')
  .controller('ModalEditConfigController', ModalEditConfigController)
;
