'use strict';

angular
  .module('dokkuUiApp')
  .directive('mongooseError', () => {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: (scope, element, attrs, ngModel) => {
        element.on('keydown', () => ngModel.$setValidity('mongoose', true));
      }
    };
  })
;
