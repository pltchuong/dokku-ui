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
          activity.action = activity.output.substring(0, activity.output.indexOf('\n'));
        });
      });
    } else {
      this.$location.path('/apps');
    }
  }
}

angular.module('dokkuUiApp')
  .controller('ActivitiesController', ActivitiesController);
