'use strict';

console.log(121212);

require(require('path').resolve('./config/lib/mongoose')).loadModels();

var mongoose = require('mongoose'),
  Cmd = mongoose.model('Cmd'),
  ssh = new (require('ssh2'))(),
  cp = require('child_process'),
  config = require(require('path').resolve('./config/config')),
  trimBuffer = function(buffer) {
    for (var i = 0; i < buffer.length; i++) {
      if (buffer[i] === 0x1B) {
        return trimBuffer(buffer.slice(i + 4));
      }
    }
    return buffer;
  },
  args = process.argv.slice(2).reduce(function(object, value, i) {
    var pair = value.split('=');
    object[pair[0].trim()] = pair[1].trim();
    return object;
  }, {});

mongoose.connect(config.db.uri);
Cmd.findById(args.cmdId).exec(function (err, cmd) {

  console.log(1, err);

  ssh.connect(config.dokku.ssh);
  ssh.once('ready', function() {
    ssh.exec(cmd.command, function(err, stream){

      console.log(2, err);

      stream.on('data', function(data) {
        data = trimBuffer(data);
        cmd.stdout += data;
        cmd.status = 'running';
        cmd.save();
      });

      stream.stderr.on('data', function(data) {
        data = trimBuffer(data);
        cmd.stdout += data;
        cmd.status = 'failed';
        cmd.save();
      });

      stream.on('end', function() {
        cmd.status = cmd.status === 'failed' ? cmd.status : 'succeeded';
        cmd.save(function() {
          mongoose.disconnect(function() {
            process.exit(0);
          });
        });
      });
    });
  });
});