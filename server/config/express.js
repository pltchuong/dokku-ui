'use strict';

import bodyParser from 'body-parser';
import compression from 'compression';
import config from './environment';
import connectMongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';
import errorHandler from 'errorhandler';
import express from 'express';
import favicon from 'serve-favicon';
import livereload from 'connect-livereload';
import lusca from 'lusca';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import session from 'express-session';

var MongoStore = connectMongo(session);

export default function(app) {
  var env = app.get('env');

  app.set('views', `${config.root}/server/views`);
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'dokku-ui'
    })
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if (env !== 'test' && !process.env.SAUCE_USERNAME) {
    app.use(lusca({
      csrf: {
        angular: true
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  app.set('appPath', path.join(config.root, 'client'));

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
  }

  if ('development' === env) {
    app.use(livereload({
      ignore: [
        /^\/api\/(.*)/,
        /\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/,
        /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/
      ]
    }));
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
}
