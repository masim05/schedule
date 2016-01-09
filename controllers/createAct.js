fs = require('fs');
_ = require('lodash');

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

      acts.unshift(data.act);

      // TODO implement binary search and inserting
      // for perfomance reasons when necessary.
      var sortedActs = _.sortBy(acts, function(act) {
        return - new Date(act.date + ' ' + act.time).getTime();
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
