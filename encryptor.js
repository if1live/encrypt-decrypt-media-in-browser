const aesjs = require('aes-js');

// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
const key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
// The counter is optional, and if omitted will begin at 1
const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

module.exports = {
  key: key,
  aesCtr: aesCtr,
}
