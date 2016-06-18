'use strict';

class AllActivitiesController {
  constructor($http) {
    this.$http = $http;
    this.fetch();
  }

  fetch() {
    this.$http.get('/api/activities').then(response => {
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
  }
}

angular.module('dokkuUiApp')
  .controller('AllActivitiesController', AllActivitiesController);