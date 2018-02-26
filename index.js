const aesjs = require('aes-js');
// shared variable
var encryptedBytes = null;
var encKey = null;

document.querySelector('.btn-fetch-enc').onclick = function() {
  var btn = this;

  let url = '/assets/media-encrypt/sample.gif.enc';
  fetch(url).then(function(resp) {
    return resp.blob();
  }).then(function(blob) {
    let reader = new FileReader();
    reader.addEventListener('loadend', function() {
      let view = new Uint8Array(this.result);
      encryptedBytes = view;


      console.log('fetch enc complete');
      btn.disabled = true;
    });
    reader.readAsArrayBuffer(blob);
  });
};

document.querySelector('.btn-fetch-key').onclick = function() {
  var btn = this;

  let url = '/assets/key.json';
  fetch(url).then(function(resp) {
    return resp.json();
  }).then(function(json) {
    encKey = json;

    console.log('fetch key complete');
    btn.disabled = true;
  });
}

document.querySelector('.btn-decrypt').onclick = function() {
  var btn = this;

  const aesCtr = new aesjs.ModeOfOperation.ctr(encKey, new aesjs.Counter(5));
  let bytes = aesCtr.decrypt(encryptedBytes);
  let el = document.querySelector('#img-dst');
  applyImage(el, 'image/gif', bytes);

  btn.disabled = true;
}

function applyImage(el, mimetype, bytes) {
  var base64String = btoa(
    bytes.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  let base64 = `data:${mimetype};base64,` + base64String;
  el.src = base64;
}
