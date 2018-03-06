
const config = require('./config');
const CryptoJS = require('crypto-js');

var text = config.text;

function run_text_with_aes_128_ctr(text) {
  // prepare config
  let counter = new Uint8Array(16);
  counter[15] = 5;
  let iv = CryptoJS.lib.WordArray.create(counter);

  let key = CryptoJS.lib.WordArray.create(new Uint8Array(config.aesKey));

  let cfg = {
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding,
    iv: iv,
  };

  // text -> encrypt
  let ciphertext = CryptoJS.AES.encrypt(text, key, cfg);
  let encrypted = CryptoJS.format.Hex.stringify(ciphertext);
  console.log(encrypted);

  // encrypted text -> decrypt
  let cipher = {
    ciphertext: CryptoJS.enc.Hex.parse(encrypted),
  };
  let bytes  = CryptoJS.AES.decrypt(cipher, key, cfg);
  let plaintext = bytes.toString(CryptoJS.enc.Utf8);
  console.log(plaintext);
}

run_text_with_aes_128_ctr(text);
