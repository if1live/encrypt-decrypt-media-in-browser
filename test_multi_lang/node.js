
const config = require('./config');
const CryptoJS = require('crypto-js');
const aesjs = require('aes-js');

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
  let bytes = CryptoJS.AES.decrypt(cipher, key, cfg);
  let plaintext = bytes.toString(CryptoJS.enc.Utf8);
  console.log(plaintext);
}

function run_text_with_aes_128_ctr_ase_js(text) {
  // Convert text to bytes
  var textBytes = aesjs.utils.utf8.toBytes(text);

  // The counter is optional, and if omitted will begin at 1
  var aesCtr = new aesjs.ModeOfOperation.ctr(config.aesKey, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  console.log(encryptedHex);
  // "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
  //  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

  // When ready to decrypt the hex string, convert it back to bytes
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  var aesCtr = new aesjs.ModeOfOperation.ctr(config.aesKey, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);

  // Convert our bytes back into text
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  console.log(decryptedText);
  // "Text may be any length you wish, no padding is required."
}

run_text_with_aes_128_ctr(text);
run_text_with_aes_128_ctr_ase_js(text);
