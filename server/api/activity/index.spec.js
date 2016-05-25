'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var activityCtrlStub = {
  index: 'activityCtrl.index',
  show: 'activityCtrl.show',
  create: 'activityCtrl.create',
  update: 'activityCtrl.update',
  destroy: 'activityCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var activityIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './activity.controller': activityCtrlStub
});

describe('Activity API Router:', function() {

  it('should return an express router instance', function() {
    activityIndex.should.equal(routerStub);
  });

  describe('GET /api/activities', function() {

    it('should route to activity.controller.index', function() {
      routerStub.get
        .withArgs('/', 'activityCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/activities/:id', function() {

    it('should route to activity.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'activityCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/activities', function() {

    it('should route to activity.controller.create', function() {
      routerStub.post
        .withArgs('/', 'activityCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/activities/:id', function() {

    it('should route to activity.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'activityCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/activities/:id', function() {

    it('should route to activity.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'activityCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/activities/:id', function() {

    it('should route to activity.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'activityCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
