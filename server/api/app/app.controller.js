'use strict';

import Activity from '../activity/activity.model';
import App from './app.model';
import Q from 'q';
import SSH from 'ssh-promise';
import User from '../user/user.model';
import _ from 'lodash';
import config from '../../config/environment';
import email from 'emailjs';
import emailtemplates from 'email-templates';
import path from 'path';
import url from 'url';

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
    return App
      .find()
      .sort('name')
      .populate('collaborators', 'username firstName lastName email')
      .exec()
    ;
  };
}

function findOneByUniqueProperty(uniqueProperty) {
  return function() {
    return App
      .findOne({
        $or: [
          {
            _id: uniqueProperty
          },
          {
            name: uniqueProperty
          }
        ]
      })
      .populate('collaborators', 'username firstName lastName email')
      .exec()
    ;
  };
}

function sendEmail(recipients, template, app, req) {
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
              url: url.format({
                protocol: req.protocol,
                hostname: req.hostname,
                port: config.port
              }),
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
    .fcall(handleParameters(req, res, ['name']))
    .then(() => {
      var ssh = new SSH(config.ssh);
      return ssh.exec(`dokku apps:create ${req.body.name}`);
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
    .then((app) => {
      sendEmail(_.difference(app.collaborators, req.body.collaborators), 'collaborator-removed', app, req);
      sendEmail(_.difference(req.body.collaborators, app.collaborators), 'collaborator-added', app, req);
      return app;
    })
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .then(handleEntityNotFound(res))
    .catch(handleError(res))
  ;
}


export function destroy(req, res) {
  return Q
    .fcall(handleParameters(req, res, ['name']))
    .then(() => {
      var ssh = new SSH(config.ssh);
      return ssh.exec(`echo ${req.body.name} | dokku apps:destroy ${req.body.name}`);
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
  ;
}

export function configs(req, res) {
  var ssh = new SSH(config.ssh);

  return Q
    .fcall(handleParameters(req, res, ['id']))
    .then(findOneByUniqueProperty(req.params.id))
    .then((app) => {
      if (app) {
        var commands = [];
        var set = '';
        var unset = '';
        for(var key in req.body) {
          var value = req.body[key];
          if(value === null) {
            unset += key;
          } else {
            set += `${key}=${value}`;
          }
        }
        if (set) {
          commands.push(`dokku config:set --no-restart ${app.name} ${set} > /dev/null`);
        }
        if (unset) {
          commands.push(`dokku config:unset --no-restart ${app.name} ${unset} > /dev/null`);
        }

        return ssh.exec(commands);
      }
      return null;
    })
    .then(respondWithBlank(res))
    .then(findOneByUniqueProperty(req.params.id))
    .then((app) => {
      if (app) {
        return ssh.exec(`dokku ps:restart ${app.name} > /dev/null`);
      }
      return null;
    })
    .then(handleEntityNotFound(res))
    .catch(handleError(res))
  ;
}

export var activities = {

  index(req, res) {
    return Q
      .fcall(handleParameters(req, res, ['id']))
      .then(findOneByUniqueProperty(req.params.id))
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
      .then(handleEntityNotFound(res))
      .catch(handleError(res))
    ;
  },

  show(req, res) {
    return Q
      .fcall(handleParameters(req, res, ['id', 'activity']))
      .then(findOneByUniqueProperty(req.params.id))
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
      .then(handleEntityNotFound(res))
      .catch(handleError(res))
    ;
  }

};
