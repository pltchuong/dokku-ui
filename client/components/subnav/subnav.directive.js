'use strict';

angular
  .module('dokkuUiApp')
  .directive('subnav', () => ({
    templateUrl: 'components/subnav/subnav.html',
    restrict: 'E',
    controller: 'SubnavController',
    controllerAs: 'subnav'
  }))
;
