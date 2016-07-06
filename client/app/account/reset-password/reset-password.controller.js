'use strict';

class ResetPasswordController {

  constructor($http, $location, $state) {
    this.$http = $http;
    this.$location = $location;
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
      if (this.user.password === this.user.password2) {
        this.$http
          .patch('/api/users/password/reset', {
            token: this.$location.search().token,
            password: this.user.password
          })
          .then(() => {
            this.user = {};
            this.reset(form);
            this.message = 'Password has been reset';
          })
          .catch((err) => {
            this.errors.other = err.data || err.statusText;
          })
        ;
      } else {
        this.errors.other = 'Password mismatch';
      }
    }
  }
}

angular
  .module('dokkuUiApp')
  .controller('ResetPasswordController', ResetPasswordController)
;
