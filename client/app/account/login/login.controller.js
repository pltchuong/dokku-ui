'use strict';

class LoginController {

  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;

    this.user = {};
    this.errors = {};
    this.submitted = false;
  }

  reset(form) {
    form.$setUntouched();
    this.errors = {};
    this.submitted = false;
  }

  submit(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth
        .login(this.user.email, this.user.password)
        .then(() => {
          this.$state.go('apps.index');
        })
        .catch((err) => {
          this.errors.other = err.data || err.statusText;
        })
      ;
    }
  }
}

angular
  .module('dokkuUiApp')
  .controller('LoginController', LoginController)
;
