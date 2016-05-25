'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = require('../..');


var newApp;

describe('App API:', function () {

  describe('GET /api/apps', function () {
    var apps;

    beforeEach(function (done) {
      (0, _supertest2.default)(app).get('/api/apps').expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        apps = res.body;
        done();
      });
    });

    it('should respond with JSON array', function () {
      apps.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/apps', function () {
    beforeEach(function (done) {
      (0, _supertest2.default)(app).post('/api/apps').send({
        name: 'New App',
        info: 'This is the brand new app!!!'
      }).expect(201).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        newApp = res.body;
        done();
      });
    });

    it('should respond with the newly created app', function () {
      newApp.name.should.equal('New App');
      newApp.info.should.equal('This is the brand new app!!!');
    });
  });

  describe('GET /api/apps/:id', function () {
    var app;

    beforeEach(function (done) {
      (0, _supertest2.default)(app).get('/api/apps/' + newApp._id).expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        app = res.body;
        done();
      });
    });

    afterEach(function () {
      app = {};
    });

    it('should respond with the requested app', function () {
      app.name.should.equal('New App');
      app.info.should.equal('This is the brand new app!!!');
    });
  });

  describe('PUT /api/apps/:id', function () {
    var updatedApp;

    beforeEach(function (done) {
      (0, _supertest2.default)(app).put('/api/apps/' + newApp._id).send({
        name: 'Updated App',
        info: 'This is the updated app!!!'
      }).expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        updatedApp = res.body;
        done();
      });
    });

    afterEach(function () {
      updatedApp = {};
    });

    it('should respond with the updated app', function () {
      updatedApp.name.should.equal('Updated App');
      updatedApp.info.should.equal('This is the updated app!!!');
    });
  });

  describe('DELETE /api/apps/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      (0, _supertest2.default)(app).delete('/api/apps/' + newApp._id).expect(204).end(function (err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
    });

    it('should respond with 404 when app does not exist', function (done) {
      (0, _supertest2.default)(app).delete('/api/apps/' + newApp._id).expect(404).end(function (err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });
});
//# sourceMappingURL=app.integration.js.map
