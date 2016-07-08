'use strict';

class ModalEditCollaboratorsController {

  constructor(close, $http, $timeout, collaborators) {
    this.exit = close;
    this.$http = $http;
    this.$timeout = $timeout;
    this.inputs = {
      collaborators: collaborators
    };
    this.fetch();
  }

  fetch() {
    this.$http
      .get('/api/users')
      .then((response) => {
        this.inputs.users = response.data.filter((user) => {
          return !(this.inputs.collaborators.find((collaborator) => {
            return collaborator.username === user.username;
          }));
        });
      })
    ;
  }

  resize($scope) {
    setTimeout(() => {
      // copied from select.js to fix small input issue
      var ctrl = $scope.$select,
        sizeWatch = null,
        updaterScheduled = false,
        input = ctrl.searchInput[0],
        container = ctrl.searchInput
          .parent()
          .parent()[0],
        calculateContainerWidth = function() {
          // Return the container width only if the search input is visible
          return container.clientWidth * !!input.offsetParent;
        },
        updateIfVisible = function(containerWidth) {
          if (containerWidth === 0) {
            return false;
          }
          var inputWidth = containerWidth - input.offsetLeft - 10;
          if (inputWidth < 50) inputWidth = containerWidth;
          ctrl.searchInput.css('width', `${inputWidth}px`);
          return true;
        };

      ctrl.searchInput.css('width', '10px');
      this.$timeout(() => { //Give tags time to render correctly
        if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
          sizeWatch = $scope.$watch(angular.noop, () => {
            if (!updaterScheduled) {
              updaterScheduled = true;
              $scope.$$postDigest(() => {
                updaterScheduled = false;
                if (updateIfVisible(calculateContainerWidth())) {
                  sizeWatch();
                  sizeWatch = null;
                }
              });
            }
          });
        }
      });
    }, 500);
  }

  close() {
    this.exit({
      collaborators: this.inputs.collaborators
    }, 500);
  }

}

angular
  .module('dokkuUiApp')
  .controller('ModalEditCollaboratorsController', ModalEditCollaboratorsController)
;
