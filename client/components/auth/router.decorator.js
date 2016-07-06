'use strict';

angular
  .module('dokkuUiApp.auth')
  .run(($rootScope, $state, Auth) => {
    $rootScope.$on('$stateChangeStart', (event, next) => {
      if (!next.authenticate) {
        return;
      }
      if (typeof next.authenticate === 'string') {
        Auth
          .hasRole(next.authenticate, _.noop)
          .then((has) => {
            if (has) {
              return;
            }

            event.preventDefault();
            return Auth
              .isLoggedIn(_.noop)
              .then((is) => {
                $state.go(is ? 'apps.index' : 'index');
              })
            ;
          })
        ;
      } else {
        Auth
          .isLoggedIn(_.noop)
          .then((is) => {
            if (is) {
              return;
            }
            event.preventDefault();
            $state.go('index');
          })
        ;
      }
    });
  })
;
