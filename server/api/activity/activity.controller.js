'use strict';

import Activity from './activity.model';
import Q from 'q';
import _ from 'lodash';

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
    if(_.difference(parameters.sort(), requestParams.sort()).length > 0) {
      res
        .status(400)
        .end()
      ;
    }
    return null;
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

function findAll() {
  return function() {
    return Activity
      .find()
      .populate('user', 'username firstName lastName email')
      .populate('app', 'name')
      .sort('-created_at')
      .exec()
    ;
  };
}

export function index(req, res) {
  return Q
    .fcall(handleParameters(req, res, []))
    .then(findAll())
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
}
