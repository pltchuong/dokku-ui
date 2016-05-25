/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/apps              ->  index
 * POST    /api/apps              ->  create
 * GET     /api/apps/:id          ->  show
 * PUT     /api/apps/:id          ->  update
 * DELETE  /api/apps/:id          ->  destroy
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

var _app = require('./app.model');

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

// Gets a list of Apps
function index(req, res) {
  return _app2.default.find().populate('collaborators').exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single App from the DB
function show(req, res) {
  return _app2.default.findOne(appIdOrName(req.params.id)).populate('collaborators').exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new App in the DB
function create(req, res) {
  return _app2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Updates an existing App in the DB
function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _app2.default.findOne(appIdOrName(req.params.id)).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a App from the DB
function destroy(req, res) {
  return _app2.default.findOne(appIdOrName(req.params.id)).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=app.controller.js.map
