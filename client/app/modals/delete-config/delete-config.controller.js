'use strict';

class ModalDeleteConfigController {

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
  .controller('ModalDeleteConfigController', ModalDeleteConfigController)
;
