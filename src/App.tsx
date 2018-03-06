import * as React from 'react';
import './App.css';
import * as CryptoJS from 'crypto-js';
import * as aesjs from 'aes-js';

class EncryptedImage extends React.Component<any, any> {
  render() {
    return (
      <div>
        <img src={this.props.src} />
        <dl>
          <dt>elapsed time</dt>
          <dd>{this.props.elapsedTime}</dd>
        </dl>
      </div>
    );
  }
}

class FetchEncButton extends React.Component<any, any> {
  state = {
    disabled: false,
    desc: 'fetch enc',
  };

  onclick() {
    this.setRunningState();

    let uri = '/assets/media-encrypt/sample.gif.aes128';
    fetch(uri).then((resp) => {
      return resp.blob();

    }).then((blob) => {
      let reader = new FileReader();
      let that = this;
      reader.addEventListener('loadend', function () {
        let view = new Uint8Array(this.result);
        let encryptedBytes = view;

        that.setState({
          disabled: false,
          desc: `fetch enc: length=${encryptedBytes.length}`,
        });
        that.props.setEncrypted(encryptedBytes);
      });
      reader.readAsArrayBuffer(blob);

    }).catch((err) => {
      this.setInitialState();
    });
  }

  setRunningState() {
    this.setState({
      disabled: true,
      desc: 'fetch enc...',
    });
  }

  setInitialState() {
    this.setState({
      disable: false,
      desc: 'fetch enc',
    });
  }

  render() {
    return (
      <button type="button" onClick={() => this.onclick()} disabled={this.state.disabled}>
        {this.state.desc}
      </button>
    );
  }
}

class FetchKeyButton extends React.Component<any, any> {
  state = {
    disabled: false,
    desc: 'fetch key',
  };

  onclick() {
    this.setRunningState();

    let uri = '/assets/key.json';
    fetch(uri).then((resp) => {
      return resp.json();

    }).then((json) => {
      let enckey = json;

      this.setState({
        disabled: false,
        desc: `enc key: ok`,
      });
      this.props.setEncKey(enckey);

    }).catch((err) => {
      this.setInitialState();
    });
  }

  setRunningState() {
    this.setState({
      disabled: true,
      desc: 'fetch key...',
    });
  }

  setInitialState() {
    this.setState({
      disable: false,
      desc: 'fetch enc',
    });
  }

  render() {
    return (
      <button type="button" onClick={() => this.onclick()} disabled={this.state.disabled}>
        {this.state.desc}
      </button>);
  }
}

class DecryptButton extends React.Component<any, any> {
  render() {
    return (<button type="button" onClick={this.props.decrypt}>decrypt</button>);
  }
}

class ButtonGroup extends React.Component<any, any> {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <div>
          <FetchEncButton setEncrypted={this.props.setEncrypt} />
          <FetchKeyButton setEncKey={this.props.setEncKey} />
          <DecryptButton decrypt={this.props.decrypt}/>
        </div>
      </div>
    );
  }
}

class SampleApp extends React.Component<any, any> {
  state = {
    encrypted: undefined,
    encKey: new Uint8Array(0),
    mimetype: 'image/gif',

    elapsedTime: 0,
    src: 'todo',
  };

  setEncKey(key: number[]) {
    this.setState({
      encKey: key,
      src: 'todo',
    });
  }

  setEncrypted(bytes: Uint8Array) {
    this.setState({
      encrypted: bytes,
      src: 'todo',
    });
  }

  decryptAES128CryptoJS() {
    const startTime = new Date();
    const { encKey, encrypted, mimetype } = this.state;

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
    let key = CryptoJS.lib.WordArray.create(new Uint8Array(encKey));
    let bytes = CryptoJS.AES.decrypt(cipher, key, cfg);
    let base64String = bytes.toString(CryptoJS.enc.Base64);
    let dataURI = this.createDataURI(mimetype, base64String);

    const endTime = new Date();
    const elapsedTime = endTime.getTime() - startTime.getTime();

    this.setState({
      src: dataURI,
      elapsedTime: elapsedTime,
    });
  }

  decryptAES128AesJS() {
    const startTime = new Date();
    const { encKey, encrypted, mimetype } = this.state;

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    let aesCtr = new aesjs.ModeOfOperation.ctr(encKey, new aesjs.Counter(5));
    let decryptedBytes: Uint8Array = aesCtr.decrypt(encrypted);
    let base64String = btoa(
      decryptedBytes.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    let dataURI = this.createDataURI(mimetype, base64String);

    const endTime = new Date();
    const elapsedTime = endTime.getTime() - startTime.getTime();

    this.setState({
      src: dataURI,
      elapsedTime: elapsedTime,
    });
  }

  isReady() {
    const { encKey, encrypted, mimetype } = this.state;
    return (!!encKey && !!encrypted && !!mimetype);
  }

  createDataURI(mimetype: string, base64String: string): string {
    return `data:${mimetype};base64,` + base64String;
  }

  render() {
    const setEncrypt = this.setEncrypted.bind(this);
    const setEncKey = this.setEncKey.bind(this);
    const decryptAES128CryptoJS = this.decryptAES128CryptoJS.bind(this);
    const decryptAES128AesJS = this.decryptAES128AesJS.bind(this);

    return (
      <div>
        <h1>decrypt image</h1>
        <EncryptedImage src={this.state.src} elapsedTime={this.state.elapsedTime} />
        <ButtonGroup
          title="AES-128 (crypto-js)"
          setEncrypt={setEncrypt}
          setEncKey={setEncKey}
          decrypt={decryptAES128CryptoJS}
        />
        <ButtonGroup
          title="AES-128 (aes-js)"
          setEncrypt={setEncrypt}
          setEncKey={setEncKey}
          decrypt={decryptAES128AesJS}
        />
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <SampleApp />
    );
  }
}

export default App;
