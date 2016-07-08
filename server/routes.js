'use strict';

import api_activity from './api/activity';
import api_app from './api/app';
import api_auth from './auth';
import api_user from './api/user';
import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/activities', api_activity);
  app.use('/api/users', api_user);
  app.use('/api/apps', api_app);
  app.use('/auth', api_auth);
  // All undefined asset or api routes should return a 404
  app
    .route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404])
  ;

  // All other routes should redirect to the index.html
  app
    .route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    })
  ;
}
