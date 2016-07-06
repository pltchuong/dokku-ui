'use strict';

import _ from 'lodash';
import Q from 'q';
import Activity from './activity.model';

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

function handleError(res, statusCode) {
  return function(err) {
    res
      .status(statusCode || 500)
      .send(err)
    ;
    return null;
  };
}

export function index(req, res) {
  return Q
    .fcall(handleParameters(req, res, []))
    .then(() => {
      return Activity
        .find()
        .populate('user', 'username firstName lastName email')
        .populate('app', 'name')
        .sort('-created_at')
        .exec()
      ;
    })
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
}
