'use strict';

import _ from 'lodash';
import Q from 'q';
import App from './app.model';
import Activity from '../activity/activity.model';

function respondWithResult(res, statusCode) {
  return function(entity) {
    if (entity) {
      res
        .status(statusCode || 200)
        .json(entity)
      ;
    }
    return entity;
  };
}

function handleParameters(req, res, parameters) {
  return function() {
    var requestParams = _.union(Object.keys(req.body), Object.keys(req.params));
    if(!_.isEqual(requestParams.sort(), parameters.sort())) {
      res
        .status(400)
        .end()
      ;
    }
    return null;
  }
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res
        .status(404)
        .end()
      ;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  return function(err) {
    res
      .status(statusCode || 500)
      .send(err)
    ;
    return null;
  };
}

function appIdOrName(appIdOrName) {
  return {
    $or: [
      {
        _id: appIdOrName
      },
      {
        name: appIdOrName
      }
    ]
  };
}

export function index(req, res) {
  return Q
    .fcall(handleParameters(req, res, []))
    .then(() => {
      return App
        .find()
        .sort('name')
        .populate('collaborators', 'username firstName lastName email')
        .exec()
      ;
    })
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
}

export function show(req, res) {
  return Q
    .fcall(handleParameters(req, res, ['id']))
    .then(() => {
      return App
      .findOne(appIdOrName(req.params.id))
      .populate('collaborators', 'username firstName lastName email')
      .exec()
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
}

export function create() {
  // ssh
}

export function update() {
  // ssh
}

export function destroy() {
  // ssh
}

export function configs() {
  // ssh
}

export var activities = {

  index(req, res) {
    return Q
      .fcall(handleParameters(req, res, ['id']))
      .then(() => {
        return App
          .findOne(appIdOrName(req.params.id))
          .exec()
        ;
      })
      .then((app) => {
        return Activity
          .find({
            app: app._id
          })
          .populate('user', 'username firstName lastName')
          .populate('app', 'name')
          .sort('-created_at')
          .exec()
        ;
      })
      .then(respondWithResult(res))
      .catch(handleError(res))
    ;
  },

  show(req, res) {
    return Q
      .fcall(handleParameters(req, res, ['id', 'activity']))
      .then(() => {
        return App
          .findOne(appIdOrName(req.params.id))
          .exec()
        ;
      })
      .then((app) => {
        return Activity
          .findOne({
            _id: req.params.activity,
            app: app._id
          })
          .populate('user', 'username firstName lastName')
          .populate('app', 'name')
          .exec()
        ;
      })
      .then(respondWithResult(res))
      .catch(handleError(res))
    ;
  }

};
