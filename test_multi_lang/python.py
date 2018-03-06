import json
import os
from Crypto.Cipher import AES
from Crypto.Util import Counter
import binascii


def load_config():
    fp = os.path.join(os.path.dirname(__file__), 'config.json')
    f = open(fp)
    return json.load(f)

config = load_config()
text = config['text']

def create_aes_128_ctr_cipher():
    hex_str = ' '.join(['{0:02X}'.format(x) for x in config['aesKey']])
    key = bytes(bytearray.fromhex(hex_str))

    counter_nbit = 128
    counter_initial_value = 5
    ctr = Counter.new(counter_nbit, initial_value=counter_initial_value)
    cipher = AES.new(key, AES.MODE_CTR, counter=ctr)
    return cipher

def run_text_with_aes_128_ctr(text):
    # encrypt
    cipher = create_aes_128_ctr_cipher()
    ct = cipher.encrypt(text.encode('utf-8'))
    print(binascii.hexlify(ct).decode('utf-8'))

    # decrypt. do not reuse cipher
    cipher = create_aes_128_ctr_cipher()
    text = cipher.decrypt(ct)
    print(text.decode('utf-8'))


run_text_with_aes_128_ctr(text)


