'use strict';

class ActivitiesController {

  constructor($stateParams, $http, $location) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$location = $location;
    this.fetch();
  }

  fetch() {
    if(this.$stateParams.app) {
      this.$http.get('/api/apps/' + this.$stateParams.app + '/activities').then(response => {
        this.activities = response.data;
        this.activities.forEach(function(activity) {
          activity.commands.forEach(function(command, i) {
            activity.commands[i] = command.trim();
            var rev = command.match(/^git-build ([0-9a-z]{40})$/);
            if(rev && rev[1]) {
              activity.rev = rev[1];
            }
          });
        });
      });
    } else {
      this.$location.path('/apps');
    }
  }
}

angular.module('dokkuUiApp')
  .controller('ActivitiesController', ActivitiesController);
