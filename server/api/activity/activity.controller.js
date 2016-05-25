/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/activities              ->  index
 * POST    /api/activities              ->  create
 * GET     /api/activities/:id          ->  show
 * PUT     /api/activities/:id          ->  update
 * DELETE  /api/activities/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Activity from './activity.model';
import App from '../app/app.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      return entity;
    }
    return null;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function appIdOrName(appIdOrName) {
  return {
    $or:[
      {_id : appIdOrName},
      {name: appIdOrName}
    ]
  };
}

// Gets a list of Activitys
export function index(req, res) {
  return App.findOne(appIdOrName(req.params.id)).exec()
    .then(function(app) {
      return Activity.find({app: app._id})
        .populate('user', 'username firstName lastName email')
        .populate('app', 'name')
        .sort('field -updated_at')
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
    });
}

// Gets a single Activity from the DB
export function show(req, res) {
  return Activity.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Activity in the DB
export function create(req, res) {
  return Activity.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Activity in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Activity.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Activity from the DB
export function destroy(req, res) {
  return Activity.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
