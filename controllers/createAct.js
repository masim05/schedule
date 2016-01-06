fs = require('fs');

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
