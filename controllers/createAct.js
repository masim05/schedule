fs = require('fs');
_ = require('lodash');
crypto = require('crypto');

module.exports = function createAct(filename, socket) {
  var controller = function(data) {
    fs.readFile(filename, function(err, content) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      try {
        acts = JSON.parse(content);
      } catch (err) {
        console.error(err.stack);
        return;
      }

      const sha1 = crypto.createHash('sha1');
      sha1.update(JSON.stringify(data.act) + process.hrtime().join('-') + Date.now());
      data.act.id = sha1.digest('hex');

      acts.unshift(data.act);

      // TODO implement binary search and inserting
      // for perfomance reasons when necessary.
      var sortedActs = _.sortBy(acts, function(act) {
        return - new Date(act.start.date + ' ' + act.start.time).getTime();
      });

      fs.writeFile(filename, JSON.stringify(sortedActs), function (err) {
        if (err) {
          console.error(err.stack);
          return;
        }
      });
    });
  };

  return controller;
};
