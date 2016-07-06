'use strict';

angular
  .module('dokkuUiApp.util')
  .factory('Util', ($window) => {
    var Util = {
      safeCb(cb) {
        return angular.isFunction(cb) ? cb : angular.noop;
      },

      urlParse(url) {
        var a = document.createElement('a');
        a.href = url;
        if (a.host === '') {
          a.href = a.href;
        }
        return a;
      },

      isSameOrigin(url, origins) {
        url = Util.urlParse(url);
        origins = origins && [].concat(origins) || [];
        origins = origins.map(Util.urlParse);
        origins.push($window.location);
        origins = origins.filter((origin) => {
          return url.hostname === origin.hostname && url.port === origin.port && url.protocol === origin.protocol;
        });
        return origins.length >= 1;
      }
    };

    return Util;
  })
;
