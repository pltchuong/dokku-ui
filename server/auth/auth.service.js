'use strict';

import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user/user.model';

var validateJwt = expressJwt({
  secret: config.secrets.session
});

export function isAuthenticated() {
  return compose()
    .use((req, res, next) => {
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    .use((req, res, next) => {
      User
        .findById(req.user._id)
        .exec()
        .then((user) => {
          if (!user) {
            return res
              .status(401)
              .end()
            ;
          }
          req.user = user;
          next();
          return user;
        })
        .catch((err) => next(err))
      ;
    })
  ;
}

export function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      } else {
        res
          .status(403)
          .send('Forbidden')
        ;
      }
    });
}

export function signToken(id, role) {
  return jwt.sign({
    _id: id,
    role: role
  }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

export function setTokenCookie(req, res) {
  if (!req.user) {
    return res
      .status(404)
      .send('It looks like you aren\'t logged in, please try again.')
    ;
  }
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
}
