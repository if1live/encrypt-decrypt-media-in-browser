import * as React from 'react';
import './App.css';
import * as CryptoJS from 'crypto-js';

class EncryptedImage extends React.Component<any, any> {
  state = {
    fired: false,
  };

  isReady() {
    const { encKey, encrypted, mimetype } = this.props;
    return (!!encKey && !!encrypted && !!mimetype);
  }

  createDecryptConfig(): CryptoJS.CipherOption {
    // prepare config
    let counter = new Uint8Array(16);
    counter[15] = 5;
    let iv = CryptoJS.lib.WordArray.create(counter);

    return {
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
      iv: iv,
    };
  }

  decryptToBase64(): string {
    // encrypted text -> decrypt
    const { encKey, encrypted } = this.props;

    let cipher = {
      ciphertext: CryptoJS.lib.WordArray.create(encrypted),
    };
    let cfg = this.createDecryptConfig();
    let key = CryptoJS.lib.WordArray.create(new Uint8Array(encKey));
    let bytes = CryptoJS.AES.decrypt(cipher, key, cfg);
    return bytes.toString(CryptoJS.enc.Base64);
  }

  createDataURI(): string {
    const {mimetype}  = this.props;
    const base64String = this.decryptToBase64();
    return `data:${mimetype};base64,` + base64String;
  }

  render() {
    const {mimetype}  = this.props;

    let src = 'TODO';
    let elapsedTime = 0;

    if (this.isReady()) {
      const startTime = new Date();
      src = this.createDataURI();
      const endTime = new Date();
      elapsedTime = endTime.getTime() - startTime.getTime();
    }

    return (
      <div>
        <img src={src} />
        <dl>
          <dt>mimetype</dt>
          <dd>{mimetype}</dd>
          <dt>encrypted</dt>
          <dd>{typeof(this.props.encrypted)}</dd>
          <dt>isReady</dt>
          <dd>{this.isReady().toString()}</dd>
          <dt>elapsed time</dt>
          <dd>{elapsedTime} </dd>
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

    let uri = '/assets/media-encrypt/sample.gif.enc';
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
        desc: `enc key: ${enckey}`,
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

class DecryptButton extends React.Component {
  onclick() {
    console.log('decrypt');
  }
  render() {
    return (<button type="button" onClick={this.onclick}>decrypt</button>);
  }
}

class SampleApp extends React.Component<any, any> {
  state = {
    encrypted: undefined,
    encKey: undefined,
    mimetype: 'image/gif',
  };

  setEncKey(key: number[]) {
    this.setState({
      encKey: key,
    });
  }

  setEncrypted(bytes: Uint8Array) {
    this.setState({
      encrypted: bytes,
    });
  }

  render() {
    const setEncrypt = this.setEncrypted.bind(this);
    const setEncKey = this.setEncKey.bind(this);
    return (
      <div>
        <h1>decrypt image</h1>
        <EncryptedImage encKey={this.state.encKey} encrypted={this.state.encrypted} mimetype={this.state.mimetype} />
        <h2>AES-128</h2>
        <ul>
          <li><FetchEncButton setEncrypted={setEncrypt}/></li>
          <li><FetchKeyButton setEncKey={setEncKey}/></li>
          <li><DecryptButton /></li>
        </ul>
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
