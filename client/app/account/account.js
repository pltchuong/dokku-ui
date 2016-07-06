'use strict';

angular
  .module('dokkuUiApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        parent: 'account'
      })
      .state('account', {
        abstract: true,
        templateUrl: 'app/account/account.html'
      })
      .state('account.forgot-password', {
        url: '/forgot-password',
        templateUrl: 'app/account/forgot-password/forgot-password.html',
        controller: 'ForgotPasswordController',
        controllerAs: 'vm'
      })
      .state('account.reset-password', {
        url: '/reset-password',
        templateUrl: 'app/account/reset-password/reset-password.html',
        controller: 'ResetPasswordController',
        controllerAs: 'vm'
      })
      .state('account.signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html'
      })
    ;
  })
;
