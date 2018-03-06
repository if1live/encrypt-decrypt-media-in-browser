const aesjs = require('aes-js');
const path = require('path');
const fs = require('fs');
const key = require('./public/assets/key');

function writeAES128(inputFile, outputFile) {
  // The counter is optional, and if omitted will begin at 1
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

  fs.readFile(inputFile, function(err, data) {
    if(err) {
      console.log(err);
      return;
    }

    var encryptedBytes = aesCtr.encrypt(data);
    fs.writeFile(outputFile, encryptedBytes, function(err) {
      if(err) {
        console.log(err);
        return;
      }

      console.log(`complete: ${outputFile}`)
    })
  });
}

function writeROT13(inputFile, outputFile) {
  fs.readFile(inputFile, function(err, data) {
    if(err) {
      console.log(err);
      return;
    }

    let encrypted = new Uint8Array(data.length);
    for(var i = 0 ; i < encrypted.length ; i++) {
      encrypted[i] = (data[i] + 13) % 256;
    }

    fs.writeFile(outputFile, encrypted, function(err) {
      if(err) {
        console.log(err);
        return;
      }

      console.log(`complete: ${outputFile}`)
    })
  });
}

(function() {
  let inputFile = './public/assets/media-orig/sample.gif';
  let outputFile_aes128 = './public/assets/media-encrypt/sample.gif.aes128';
  let outputFile_rot13 = './public/assets/media-encrypt/sample.gif.rot13';
  writeAES128(inputFile, outputFile_aes128);
  writeROT13(inputFile, outputFile_rot13);
})();

(function() {
  let inputFile = './public/assets/media-orig/space.jpg';
  let outputFile_aes128 = './public/assets/media-encrypt/space.jpg.aes128';
  let outputFile_rot13 = './public/assets/media-encrypt/space.jpg.rot13';
  writeAES128(inputFile, outputFile_aes128);
  writeROT13(inputFile, outputFile_rot13);
})();
