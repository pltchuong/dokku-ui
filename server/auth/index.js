'use strict';

import express from 'express';
import local from './local';
import localPassportSetup from './local/passport';

localPassportSetup();

var router = express.Router();

router.use('/local', local);

export default router;
