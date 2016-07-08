'use strict';

import _ from 'lodash';
import Q from 'q';
import uuid from 'node-uuid';
import path from 'path';
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
    if(_.difference(parameters.sort(), requestParams.sort()).length > 0) {
      res
        .status(400)
        .end()
      ;
    }
    return null;
  };
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

function findAll() {
  return function() {
    return User
      .find({}, '-salt -password -token')
      .sort('firstName')
      .exec()
    ;
  };
}

function findOneByUniqueProperty(uniqueProperty) {
  return function() {
    return User
      .findOne({
        $or: [
          {
            _id: uniqueProperty
          },
          {
            username: uniqueProperty
          },
          {
            email: uniqueProperty
          },
          {
            token: uniqueProperty
          }
        ]
      }, '-salt -password -token')
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

export function show(req, res) {
  return Q
    .fcall(handleParameters(req, res, ['id']))
    .then(findOneByUniqueProperty(req.params.id))
    .then(respondWithResult(res))
    .then(handleEntityNotFound(res))
    .catch(handleError(res))
  ;
}

export function create(req, res) {
  return Q
    .fcall(handleParameters(req, res, ['username', 'email', 'firstName', 'lastName', 'password']))
    .then(() => {
      return User.create(req.body);
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
  ;
}

export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Q
    .fcall(handleParameters(req, res, ['id']))
    .then(findOneByUniqueProperty(req.params.id))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .then(handleEntityNotFound(res))
    .catch(handleError(res))
  ;
}

export function destroy(req, res) {
  return Q
    .fcall(handleParameters(req, res, ['id']))
    .then(findOneByUniqueProperty(req.params.id))
    .then(removeEntity(res))
    .then(handleEntityNotFound(res))
    .catch(handleError(res))
  ;
}

export function me(req, res) {
  return Q
    .fcall(handleParameters(req, res, []))
    .then(findOneByUniqueProperty(req.user._id))
    .then(respondWithResult(res))
    .then(handleEntityNotFound(res))
    .catch(handleError(res))
  ;
}

export var password = {

  request(req, res) {
    return Q
      .fcall(handleParameters(req, res, ['email']))
      .then(findOneByUniqueProperty(req.body.email))
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
      .then(saveUpdates({}))
      .then(respondWithBlank(res))
      .then(handleEntityNotFound(res))
      .catch(handleError(res))
    ;
  },

  reset(req, res) {
    return Q
      .fcall(handleParameters(req, res, ['token', 'password']))
      .then(findOneByUniqueProperty(req.body.token))
      .then((user) => {
        if (user) {
          user.password = req.body.password;
          user.token = undefined;
        }
        return user;
      })
      .then(saveUpdates({}))
      .then(respondWithBlank(res))
      .then(handleEntityNotFound(res))
      .catch(handleError(res))
    ;
  }
};
