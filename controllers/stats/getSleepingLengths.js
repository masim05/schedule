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

      function extractStatsForPeriod(acts, b, e) {
        var as = _.filter(acts, function (act) {
          var begin = b.clone();
          var end = e.clone();

          if (act.type != 'Сон') {
            return false;
          }

          var start = moment(act.start.date + ' ' + act.start.time);

          if (start.isAfter(end)) {
            return false;
          }

          if (!act.finish) {
            return true;
          }

          var finish = moment(act.finish.date + ' ' + act.finish.time);

          if (finish.isBefore(begin)) {
            return false;
          }

          return true;
        });

        var minutes = as.reduce(function (total, act) {
          var begin = b.clone();
          var end = e.clone();
          var start = moment(act.start.date + ' ' + act.start.time);

          if (begin.isBefore(start)) {
            begin = start;
          }

          if (act.finish) {
            var finish = moment(act.finish.date + ' ' + act.finish.time);
            if (finish.isBefore(end)) {
              end = finish;
            }
          }

          var current = Math.floor(moment.duration(end.diff(begin)).asMinutes());

          return total + current;
        }, 0);

        return {
          minutes: minutes
        }
      }

      function extractToday(acts) {
        var begin = moment().startOf('day');
        var end = moment();

        return extractStatsForPeriod(acts, begin, end);
      }

      function extractLastDays(acts) {
        return [1, 2, 3].map(function (rollback) {
          var time = moment().subtract(rollback, 'days');
          var begin = time.clone().startOf('day');
          var end = time.clone().endOf('day');

          return extractStatsForPeriod(acts, begin, end);
        });
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
