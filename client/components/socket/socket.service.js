/* global io */
'use strict';

angular
  .module('dokkuUiApp')
  .factory('socket', (socketFactory) => {
    var ioSocket = io('', {
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket
    });

    return {
      socket,
      syncUpdates(modelName, array, cb) {
        cb = cb || angular.noop;

        socket.on(modelName + ':save', (item) => {
          var oldItem = _.find(array, {
            _id: item._id
          });
          var index = array.indexOf(oldItem);
          var event = 'created';

          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        socket.on(modelName + ':remove', (item) => {
          var event = 'deleted';
          _.remove(array, {
            _id: item._id
          });
          cb(event, item, array);
        });
      },

      unsyncUpdates(modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  })
;
