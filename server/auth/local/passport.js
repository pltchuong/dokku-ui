'use strict';

import Passport from 'passport';
import Strategy from 'passport-local';
import User from '../../api/user/user.model';

export default function() {
  Passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    return User
      .findOne({
        email: email.toLowerCase()
      })
      .exec()
      .then((user) => {
        if (user) {
          user.authenticate(password, (authError, authenticated) => {
            if (authError) {
              done(authError);
            }
            if (authenticated) {
              done(null, user);
            } else {
              done(null, false, {
                data: 'This password is not correct.'
              });
            }
          });
        } else {
          done(null, false, {
            data: 'This email is not registered.'
          });
        }
        return user;
      })
      .catch((err) => {
        done(err);
      })
    ;
  }));
}
