'use strict';

module.exports = {
  client: {
    lib: {
      css: [],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/jasny-bootstrap/dist/js/jasny-bootstrap.min.js',
        'public/lib/angular-modal-service/dst/angular-modal-service.min.js',
        'public/lib/angular-ui-select/dist/select.min.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
