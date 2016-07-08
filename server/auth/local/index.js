'use strict';

import * as auth from '../auth.service';
import express from 'express';
import passport from 'passport';

var router = express.Router();

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    var error = err || info;
    if (error) {
      return res
        .status(401)
        .json(error)
      ;
    }
    if (!user) {
      return res
        .status(404)
        .json({
          data: 'Something went wrong, please try again.'
        })
      ;
    }

    var token = auth.signToken(user._id, user.role);
    res.json({
      token
    });
  })(req, res, next);
});

export default router;
