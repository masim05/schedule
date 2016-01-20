fs = require('fs');
_ = require('lodash');
crypto = require('crypto');

module.exports = function deleteAct(filename, socket) {
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

      _.remove(acts, function(a) {
        return a.id == data.act.id;
      })

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
