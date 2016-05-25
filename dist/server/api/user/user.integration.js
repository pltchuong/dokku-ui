'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = require('../..');


var newUser;

describe('User API:', function () {

  describe('GET /api/users', function () {
    var users;

    beforeEach(function (done) {
      (0, _supertest2.default)(app).get('/api/users').expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        users = res.body;
        done();
      });
    });

    it('should respond with JSON array', function () {
      users.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/users', function () {
    beforeEach(function (done) {
      (0, _supertest2.default)(app).post('/api/users').send({
        name: 'New User',
        info: 'This is the brand new user!!!'
      }).expect(201).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        newUser = res.body;
        done();
      });
    });

    it('should respond with the newly created user', function () {
      newUser.name.should.equal('New User');
      newUser.info.should.equal('This is the brand new user!!!');
    });
  });

  describe('GET /api/users/:id', function () {
    var user;

    beforeEach(function (done) {
      (0, _supertest2.default)(app).get('/api/users/' + newUser._id).expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        user = res.body;
        done();
      });
    });

    afterEach(function () {
      user = {};
    });

    it('should respond with the requested user', function () {
      user.name.should.equal('New User');
      user.info.should.equal('This is the brand new user!!!');
    });
  });

  describe('PUT /api/users/:id', function () {
    var updatedUser;

    beforeEach(function (done) {
      (0, _supertest2.default)(app).put('/api/users/' + newUser._id).send({
        name: 'Updated User',
        info: 'This is the updated user!!!'
      }).expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        updatedUser = res.body;
        done();
      });
    });

    afterEach(function () {
      updatedUser = {};
    });

    it('should respond with the updated user', function () {
      updatedUser.name.should.equal('Updated User');
      updatedUser.info.should.equal('This is the updated user!!!');
    });
  });

  describe('DELETE /api/users/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      (0, _supertest2.default)(app).delete('/api/users/' + newUser._id).expect(204).end(function (err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
    });

    it('should respond with 404 when user does not exist', function (done) {
      (0, _supertest2.default)(app).delete('/api/users/' + newUser._id).expect(404).end(function (err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });
});
//# sourceMappingURL=user.integration.js.map
