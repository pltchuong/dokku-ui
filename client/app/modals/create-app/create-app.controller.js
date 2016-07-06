'use strict';

class CreateAppConfigController {

  constructor(close, name) {
    this.exit = close;
    this.inputs = {
      name: name
    };
  }

  close() {
    this.exit({
      name: this.inputs.name
    }, 500);
  }

}

angular
  .module('dokkuUiApp')
  .controller('CreateAppConfigController', CreateAppConfigController)
;
