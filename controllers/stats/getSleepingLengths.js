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
        var acts = JSON.parse(content);
      }
      catch (err) {
        console.error(err.stack);
        return;
      }

      var out = {
        today: extractToday(acts),
        lastDays: extractLastDays(acts),
        weekAverage: extractWeekAvegare(acts)
      };

      emitable.emit('sleepingLengths', out);

      function extractToday(acts) {
        var as = _.filter(acts, function (act) {

          if (act.type != 'Сон') {
            return false;
          }

          if (!act.finish) {
            return true;
          }

          var begin = moment().startOf('day');

          if (moment(act.finish.date + ' ' + act.finish.time).isBefore(begin)) {
            return false;
          }

          return true;
        });

        var minutes = as.reduce(function (total, act) {
          var begin = moment().startOf('day'), end = moment();
          var start = moment(act.start.date + ' ' + act.start.time);
          if (begin.isBefore(start)) {
            begin = start;
          }

          if (act.finish) {
            end = moment(act.finish.date + ' ' + act.finish.time);
          }

          var current = Math.floor(moment.duration(end.diff(begin)).asMinutes());

          return total + current;
        }, 0);

        return {
          minutes: minutes
        }
      }

      function extractLastDays(acts) {
        return [
          {
            minutes: 740
          },
          {
            minutes: 750
          },
          {
            minutes: 760
          }
        ]
      }

      function extractWeekAvegare(acts) {
        return {
          minutes: 748
        }
      }
    });
  };

  return controller;
};
