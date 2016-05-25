'use strict';

var express = require('express');
var controller = require('./app.controller');
var activity = require('../activity/activity.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.get('/:id/activities', activity.index);

module.exports = router;
//# sourceMappingURL=index.js.map
