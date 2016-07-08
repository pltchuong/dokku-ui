'use strict';

import * as auth from '../../auth/auth.service';
import * as controller from './activity.controller';
import express from 'express';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);

export default router;
