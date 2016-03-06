fs = require('fs');
_ = require('lodash');
crypto = require('crypto');
moment = require('moment');

module.exports = function getSleepingLengths(filename, emitable) {
  var controller = function () {
    console.log('getSleepingLengths called.');
    fs.readFile(filename, function (err, content) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      try {
        acts = JSON.parse(content);
      }
      catch (err) {
        console.error(err.stack);
        return;
      }

      var out = {
        today: {
          minutes: 135
        },
        lastDays: [
          {
            minutes: 740
          },
          {
            minutes: 750
          },
          {
            minutes: 760
          }
        ],
        weekAverage: {}
      };
      emitable.emit('sleepingLengths', out);
    });
  };

  return controller;
};
