const aesjs = require('aes-js');
const path = require('path');
const fs = require('fs');
const key = require('./static/key');

// The counter is optional, and if omitted will begin at 1
const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

if(process.argv.length != 4) {
  console.error(`node ${path.basename(__filename)} <input_file> <outout_file>`);
  process.exit(1);
}

let inputFile = process.argv[2];
let outputFlie = process.argv[3];

fs.readFile(inputFile, function(err, data) {
  if(err) {
    console.log(err);
    return;
  }

  var encryptedBytes = aesCtr.encrypt(data);
  fs.writeFile(outputFlie, encryptedBytes, function(err) {
    if(err) {
      console.log(err);
      return;
    }
  })
});

