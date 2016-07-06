'use strict';

var express = require('express');
var controller = require('./app.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.get('/:id/activities', auth.isAuthenticated(), controller.activities.index);
router.get('/:id/activities/:activity', auth.isAuthenticated(), controller.activities.show);

router.patch('/:id/configs', auth.isAuthenticated(), controller.configs);

module.exports = router;
