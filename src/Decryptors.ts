import * as CryptoJS from 'crypto-js';
import * as aesjs from 'aes-js';

interface Decryptor {
  decrypt(encrypted: Uint8Array): Uint8Array;
}

// aes-js
export class AESDecryptor implements Decryptor {
  private encKey: Uint8Array;
  constructor(encKey: Uint8Array) {
    this.encKey = encKey;
  }

  decrypt(encrypted: Uint8Array): Uint8Array {
    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    let aesCtr = new aesjs.ModeOfOperation.ctr(this.encKey, new aesjs.Counter(5));
    const decryptedBytes: Uint8Array = aesCtr.decrypt(encrypted);
    return decryptedBytes;
  }
}

// crypto-js
export class AESDecryptorAlter implements Decryptor {
  private encKey: Uint8Array;
  constructor(encKey: Uint8Array) {
    this.encKey = encKey;
  }

  decrypt(encrypted: Uint8Array): Uint8Array {
    // prepare config
    let counter = new Uint8Array(16);
    counter[15] = 5;
    let iv = CryptoJS.lib.WordArray.create(counter);

    var cfg = {
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
      iv: iv,
    };

    // encrypted text -> decrypt
    let cipher = {
      ciphertext: CryptoJS.lib.WordArray.create(encrypted),
    };
    let key = CryptoJS.lib.WordArray.create(new Uint8Array(this.encKey));
    let bytes = CryptoJS.AES.decrypt(cipher, key, cfg);

    let bs = bytes.words;
    let decrypted = new Uint8Array(bs.length * 4);
    for (var i = 0; i < bs.length; i++) {
      var a = bs[i] >> 24;
      var b = (bs[i] & 0x00ff0000) >> 16;
      var c = (bs[i] & 0x0000ff00) >> 8;
      var d = (bs[i] & 0x000000ff);
      decrypted[i * 4 + 0] = a;
      decrypted[i * 4 + 1] = b;
      decrypted[i * 4 + 2] = c;
      decrypted[i * 4 + 3] = d;
    }
    return decrypted;
  }
}

export class ROT13Decryptor implements Decryptor {
  decrypt(encrypted: Uint8Array): Uint8Array {
    let decrypted = new Uint8Array(encrypted.length);
    for (var i = 0; i < encrypted.length; i++) {
      decrypted[i] = (encrypted[i] + 256 - 13) % 256;
    }
    return decrypted;
  }
}

export function makeDataURI(mimetype: string, bytes: Uint8Array): string {
  const base64String = btoa(
    bytes.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return `data:${mimetype};base64,` + base64String;
}
