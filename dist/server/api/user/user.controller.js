/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  update
 * DELETE  /api/users/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      return entity;
    }
    return null;
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _lodash2.default.extend(entity, updates);
    return updated.save().then(function (updated) {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(function () {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function userIdOrUsername(userIdOrUsername) {
  return {
    $or: [{ _id: userIdOrUsername }, { username: userIdOrUsername }]
  };
}

// Gets a list of Users
function index(req, res) {
  return _user2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single User from the DB
function show(req, res) {
  return _user2.default.findOne(userIdOrUsername(req.params.id)).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new User in the DB
function create(req, res) {
  return _user2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Updates an existing User in the DB
function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _user2.default.findOne(userIdOrUsername(req.params.id)).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a User from the DB
function destroy(req, res) {
  return _user2.default.findOne(userIdOrUsername(req.params.id)).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=user.controller.js.map
