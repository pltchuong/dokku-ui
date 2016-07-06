'use strict';

angular
  .module('dokkuUiApp.auth')
  .factory('authInterceptor', ($q, $cookies, $injector, Util) => {
    var state;
    return {
      request(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },

      responseError(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('index');
          $cookies.remove('token');
        }
        return $q.reject(response);
      }
    };
  })
;
