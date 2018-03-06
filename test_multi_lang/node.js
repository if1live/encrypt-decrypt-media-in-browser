
const config = require('./config');
const CryptoJS = require('crypto-js');
const aesjs = require('aes-js');

var text = config.text;

// https://stackoverflow.com/a/34310051
function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function run_text_rot13(text) {
  // 성능 비교용
  // text -> byte array
  let data = new Uint8Array(text.length);
  for(var i = 0 ; i < data.length ; i++) {
    data[i] = text.charCodeAt(i);
  }

  // byte array -> encrypt
  let encrypted = new Uint8Array(data.length);
  for(var i = 0 ; i < encrypted.length ; i++) {
    encrypted[i] = (data[i] + 13) % 256;
  }
  let encryptedHex = toHexString(encrypted);
  console.log(encryptedHex)


  // encrypt -> decrypt
  let decrypted = new Uint8Array(encrypted.length);
  for(var i = 0 ; i < encrypted.length ; i++) {
    decrypted[i] = (encrypted[i] + 256 - 13) % 256;
  }
  let decryptedHex = toHexString(decrypted);

  // decrypt -> text
  var buffer = new Array();
  for(var i = 0 ; i < decrypted.length ; i++) {
    buffer.push(String.fromCharCode(decrypted[i]));
  }
  var output = buffer.join('');
  console.log(output);
}

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

run_text_rot13(text);
run_text_with_aes_128_ctr(text);
run_text_with_aes_128_ctr_ase_js(text);
