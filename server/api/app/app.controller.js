'use strict';

import _ from 'lodash';
import Q from 'q';
import path from 'path';
import email from 'emailjs';
import emailtemplates from 'email-templates';
import config from '../../config/environment';
import App from './app.model';
import Activity from '../activity/activity.model';
import User from '../user/user.model';

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

function saveUpdates(updates) {
  return function(entity) {
    if (entity) {
      sendEmail(_.difference(entity.collaborators, updates.collaborators), 'collaborator-removed', entity);
      sendEmail(_.difference(updates.collaborators, entity.collaborators), 'collaborator-added', entity);

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

function sendEmail(recipients, template, app) {
  if(recipients.length > 0) {
    return Q
      .fcall(() => {
        return User
          .find({
            _id: {
              $in: recipients
            }
          }, 'firstName lastName email')
          .exec()
        ;
      })
      .then((users) => {
        var server = email.server.connect(config.email.smtp);

        users.forEach((user) => {
          new emailtemplates.EmailTemplate(path.join(config.email.templateDir, template))
            .render({
              user: user,
              app: app
            })
            .then((response) => {
              server.send({
                text: response.text,
                from: config.email.from,
                to: user.email,
                subject: response.subject,
                attachment: [
                  {
                    data: response.html,
                    alternative: true
                  }
                ]
              });
            })
          ;
        });
      })
    ;
  }
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
      ;
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
}

export function create() {
  // ssh
}

export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Q
    .fcall(handleParameters(req, res, ['id']))
    .then(() => {
      return App
        .findOne(appIdOrName(req.params.id))
        .exec()
      ;
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res))
  ;
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
