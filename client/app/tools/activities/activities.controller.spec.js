'use strict';

describe('Component: ActivitiesComponent', function () {

  // load the controller's module
  beforeEach(module('dokkuUiApp'));

  var ActivitiesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ActivitiesComponent = $componentController('ActivitiesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
