'use strict';

import _ from 'lodash';
import Q from 'q';
import path from 'path';
import uuid from 'node-uuid';
import email from 'emailjs';
import emailtemplates from 'email-templates';
import config from '../../config/environment';
import User from './user.model';

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

function respondWithBlank(res, statusCode) {
  return function(entity) {
    entity = entity ? {} : null;
    if (entity) {
      res
        .status(statusCode || 200)
        .json(entity)
      ;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    if (entity) {
      var updated = _.extend(entity, updates);
      return updated
        .save()
        .then((updated) => {
          return updated;
        })
      ;
    }
    return entity;
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      entity
        .remove()
        .then(() => {
          res
            .status(204)
            .end()
          ;
        })
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

function userIdOrUsername(userIdOrUsername) {
  return {
    $or: [
      {
        _id: userIdOrUsername
      },
      {
        username: userIdOrUsername
      }
    ]
  };
}

export function index(req, res) {
  return User
    .find({}, '-salt -password -token')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
}

export function show(req, res) {
  return User
    .findOne(userIdOrUsername(req.params.id), '-salt -password -token')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
}

export function create(req, res) {
  return User
    .create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
  ;
}

export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return User
    .findOne(userIdOrUsername(req.params.id), '-salt -password -token')
    .exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
}

export function destroy(req, res) {
  return User
    .findOne(userIdOrUsername(req.params.id), '-salt -password -token')
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res))
  ;
}

export function me(req, res) {
  return User
    .findOne({
      _id: req.user._id
    }, '-salt -password -token')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
}

export var password = {

  request: function(req, res) {
    return Q
      .fcall(handleParameters(req, res, ['email']))
      .then(() => {
        return User
          .findOne({
            'email': req.body.email
          }, '-salt -password -token')
          .exec()
          .then((user) => {
            if (user) {
              user.token = uuid.v1();

              new emailtemplates.EmailTemplate(path.join(config.email.templateDir, 'forgot-password'))
                .render({
                  user: user
                })
                .then((response) => {
                  var server = email.server.connect(config.email.smtp);
                  var message = {
                    text: response.text,
                    from: config.email.from,
                    to: req.body.email,
                    subject: response.subject,
                    attachment: [
                      {
                        data: response.html,
                        alternative: true
                      }
                    ]
                  };
                  server.send(message);
                })
              ;
            }
            return user;
          })
        ;
      })
      .then(handleEntityNotFound(res))
      .then(saveUpdates({}))
      .then(respondWithBlank(res))
      .catch(handleError(res))
    ;
  },

  reset: function(req, res) {
    return Q
      .fcall(handleParameters(req, res, ['token', 'password']))
      .then(() => {
        return User
          .findOne({
            'token': req.body.token
          }, '-salt -password -token')
          .exec()
          .then((user) => {
            if (user) {
              user.password = req.body.password;
              user.token = undefined;
            }
            return user;
          })
        ;
      })
      .then(handleEntityNotFound(res))
      .then(saveUpdates({}))
      .then(respondWithBlank(res))
      .catch(handleError(res))
    ;
  }
};
