'use strict';

class ForgotPasswordController {

  constructor($http) {
    this.$http = $http;

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
      this.$http
        .post('/api/users/password/request', {
          email: this.user.email
        })
        .then(() => {
          this.user = {};
          this.reset(form);
          this.message = 'Password reset email has been sent';
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
  .controller('ForgotPasswordController', ForgotPasswordController)
;
