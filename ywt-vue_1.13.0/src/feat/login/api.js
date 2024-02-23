/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-18 10:53:38
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-12 16:03:34
 * @Description:登录API
 */
import { encrypt, } from '@/utils/crypto';
import Fetch from '@/utils/fetch';

/**
 *  账号密码登录
 * @param {String} password 用户密码
 * @param {String} userName 用户名
 */
const loginWithPWD = ({
  password = null,
  userName = null,
  uuid,
  verCode,
} = {}) => Fetch.post('/login', {
  password: encrypt(password),
  userName: userName,
  uuid,
  verCode,
});
/**
 *  科室角色登录
 * @param {Number} id 权限id
 * @param {String} refreshToken 刷新token
 */
const loginWithDept = ({
  id = null,
  refreshToken = null,
} = {}) => Fetch.post('/loginCheck', {
  id,
  refreshToken,
});
/**
 *  刷新jwt
 * @param {String} refreshToken 刷新token
 * @returns
 */
const refresh = (refreshToken) => Fetch.post('/refresh', {
  refreshToken,
});
/**
 * 修改密码
 * @param {String} pwd 新密码
 * @param {String} oldPwd 旧密码
 */
const changePWD = ({
  pwd = null,
  oldPwd = null,
} = {}) => Fetch.post('/sysManager/updatePwd', {
  pwd,
  oldPwd,
});
/**
 * 发送验证码
 */
const sendVerificationCode = (userName) => Fetch.post('/sendVerificationCode', {
  userName,
});
/**
 * 用户重置密码
 */
const resetPwd = ({
  password,
  userName,
  verificationCode,
} = {}) => Fetch.post('/resetPwd', {
  password,
  userName,
  verificationCode,
});
/**
 * 获取系统配置
 * 用于是否需要图片验证码
 */
const getLoginSystemConfig = () => Fetch.post('/sysSystem/get', { key: 'LOGIN_CAPTCHA', });

/**
 * 获取加密key
 */
const getEncryptionKey = () => Fetch.post('/sysSystem/get', { key: 'LOGIN_AES_KEY', });

/**
 * 获取验证码
 *
 */
const getCodeImg = () => Fetch.post('/captchaImage', {});

/**
 * 退出登陆
 */
const loginOut = () => Fetch.post('/loginOut', {});

export default {
  loginWithPWD,
  loginWithDept,
  refresh,
  changePWD,
  sendVerificationCode,
  resetPwd,
  getLoginSystemConfig,
  getCodeImg,
  getEncryptionKey,
  loginOut,
};
