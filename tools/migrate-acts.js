const path = require('path');
const _ = require('lodash');
const crypto = require('crypto');

var acts;
try {
  const pathname = process.argv[2];
  acts = require(pathname);
} catch (e) {
  console.log('Error on reading storage file %s:', pathname)
  console.log(e);
  process.exit(1);
}

acts = _.sortBy(acts, function(a, i) { return -i;});

var opens = {}, pairs = [], result = [], errors = {
  duplicatedBegins: 0,
  beginlessEnds: 0
};

acts.forEach(function(act){
//  console.log(act);
  if (act.state == 'Начало') {
    if (opens[act.type]) {
      console.warn(' == Duplicated begin.');
      console.warn(opens[act.type]);
      console.warn(act);
      errors.duplicatedBegins++;
      return ;
    }
    opens[act.type] = act;
  } else {
    if (!opens[act.type]) {
      console.warn(' == End without begin.');
      console.warn(act);
      errors.beginlessEnds++;
      return ;
    }

    pairs.push({
      start: opens[act.type],
      finish: act
    });

    opens[act.type] = undefined;
  }
});
//console.log(errors);

//console.log(pairs, pairs.length);

pairs.forEach(function(p){
  var sha1 = crypto.createHash('sha1');
  sha1.update(JSON.stringify(p) + process.hrtime().join('-') + Date.now());
  var id = sha1.digest('hex');

  var entry = {
    id: id,
    type: p.start.type,
    start: {
      date: p.start.date,
      time: p.start.time
    },
    finish: {
      date: p.finish.date,
      time: p.finish.time
    }
  };
  var comment = [p.start.comment, p.finish.comment].join('; ').trim();

  if (comment && (comment != ';')) entry.comment = comment;

  result.push(entry);
});

console.log(JSON.stringify(result));
