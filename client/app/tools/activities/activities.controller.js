'use strict';

class AllActivitiesController {
  constructor($http) {
    this.$http = $http;
    this.fetch();
  }

  fetch() {
    this.$http.get('/api/activities').then(response => {
      this.activities = response.data;
    });
  }
}

angular.module('dokkuUiApp')
  .controller('AllActivitiesController', AllActivitiesController);