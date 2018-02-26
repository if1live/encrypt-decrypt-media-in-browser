const encryptor = require('./encryptor');

document.querySelector('.btn-download-and-decrypt').onclick = function() {
  let url = '/media-encrypt/sample.gif.enc';
  fetch(url).then(function(resp) {
    return resp.blob();
  }).then(function(blob) {
    let reader = new FileReader();
    reader.addEventListener('loadend', function() {
      let view = new Uint8Array(this.result);
      let bytes = encryptor.aesCtr.decrypt(view);
      let el = document.querySelector('#img-dst');
      applyImage(el, 'image/gif', bytes);
    });
    reader.readAsArrayBuffer(blob);
  });
};

function applyImage(el, mimetype, bytes) {
  var base64String = btoa(
    bytes.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  let base64 = `data:${mimetype};base64,` + base64String;
  el.src = base64;
}
