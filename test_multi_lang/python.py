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
hex_str = ' '.join(['{0:02X}'.format(x) for x in config['key']])
key = bytes(bytearray.fromhex(hex_str))
text = config['text']

def create_cipher(key):
    counter_nbit = 128
    counter_initial_value = 5
    ctr = Counter.new(counter_nbit, initial_value=counter_initial_value)
    cipher = AES.new(key, AES.MODE_CTR, counter=ctr)
    return cipher

# encrypt
cipher = create_cipher(key)
ct = cipher.encrypt(text)
print(binascii.hexlify(ct).decode('utf-8'))

# decrypt. do not reuse cipher
cipher = create_cipher(key)
text = cipher.decrypt(ct)
print(text.decode('utf-8'))
