import CryptoJS from 'crypto-js';
import store from '@/store';
// 十六位十六进制数作为密钥偏移量
const iv = CryptoJS.enc.Utf8.parse('0000000000000000');

/**
 * 加密方法
 * @param {*} word
 * @returns
 */
export function encrypt(word) {
  if (store.state.login.encryptionKey) {
    const key = CryptoJS.enc.Utf8.parse(store.state.login.encryptionKey);
    // const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, });
    return encrypted.toString();
  }
  return word;
}

/**
 *  解密方法
 * @param {*} word
 * @returns
 */
export function decrypt(word) {
  const paw = CryptoJS.enc.Utf8.parse(store.state.login.encryptionKey);

  const key = CryptoJS.enc.Utf8.parse(paw);
  const decrypt = CryptoJS.AES.decrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
