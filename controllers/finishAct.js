fs = require('fs');
_ = require('lodash');

module.exports = function finishAct(filename, socket) {
  var controller = function(data) {
    fs.readFile(filename, function(err, content) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      try {
        var acts = JSON.parse(content);
      } catch (err) {
        console.error(err.stack);
        return;
      }

      var act = _.find(acts, function(a) {
        return a.id == data.act.id;
      });

      if (!act) return;
      
      act.finish = {
        date: data.act.finish.date,
        time: data.act.finish.time
      }

      fs.writeFile(filename, JSON.stringify(acts), function (err) {
        if (err) {
          console.error(err.stack);
          return;
        }
      });
    });
  };

  return controller;
};
