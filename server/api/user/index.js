'use strict';

import * as auth from '../../auth/auth.service';
import * as controller from './user.controller';
import express from 'express';

var router = express.Router();

router.post('/password/request', controller.password.request);
router.patch('/password/reset', controller.password.reset);

router.get('/me', auth.isAuthenticated(), controller.me);

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

export default router;
