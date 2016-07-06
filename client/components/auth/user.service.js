'use strict';

angular
  .module('dokkuUiApp.auth')
  .factory('User', ($resource) => {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    });
  })
;
