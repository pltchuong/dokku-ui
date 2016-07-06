'use strict';

angular
  .module('dokkuUiApp.auth', ['dokkuUiApp.constants', 'dokkuUiApp.util', 'ngCookies', 'ui.router'])
  .config(($httpProvider) => {
    $httpProvider.interceptors.push('authInterceptor');
  })
;
