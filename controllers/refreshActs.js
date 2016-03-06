fs = require('fs');

module.exports = function refreshActs(filename, emitable) {
  var controller = function () {
    console.log('refreshActs called.');

    if (!emitable) {
      return;
    }

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

      return emitable.emit('refreshActs', {acts: acts.slice(0, 20)});
    });
  };

  return controller;
};
