/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/activities              ->  index
 * POST    /api/activities              ->  create
 * GET     /api/activities/:id          ->  show
 * PUT     /api/activities/:id          ->  update
 * DELETE  /api/activities/:id          ->  destroy
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

var _activity = require('./activity.model');

var _activity2 = _interopRequireDefault(_activity);

var _app = require('../app/app.model');

var _app2 = _interopRequireDefault(_app);

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

function appIdOrName(appIdOrName) {
  return {
    $or: [{ _id: appIdOrName }, { name: appIdOrName }]
  };
}

// Gets a list of Activitys
function index(req, res) {
  return _app2.default.findOne(appIdOrName(req.params.id)).exec().then(function (app) {
    return _activity2.default.find({ app: app._id }).populate('user', 'username firstName lastName email').populate('app', 'name').sort('field -updated_at').exec().then(respondWithResult(res)).catch(handleError(res));
  });
}

// Gets a single Activity from the DB
function show(req, res) {
  return _activity2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Activity in the DB
function create(req, res) {
  return _activity2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Updates an existing Activity in the DB
function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _activity2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Activity from the DB
function destroy(req, res) {
  return _activity2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=activity.controller.js.map
