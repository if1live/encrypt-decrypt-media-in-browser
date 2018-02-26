const aesjs = require('aes-js');
const path = require('path');
const fs = require('fs');
const encryptor = require('./encryptor');

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

  var encryptedBytes = encryptor.aesCtr.encrypt(data);
  fs.writeFile(outputFlie, encryptedBytes, function(err) {
    if(err) {
      console.log(err);
      return;
    }
  })
});

