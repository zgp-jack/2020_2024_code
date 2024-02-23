const DEFAULT_CONFIG = {

  // 文件地址
  BASE_FILE_URL: process.env.VUE_APP_FILE_URL,

  // 请求超时
  TIMEOUT: 60000,

  // TokenName // Authorization
  TOKEN_NAME: 'Authorization',

  // 成功色
  success: '#52c41a',

  // 警告色
  warning: '#faad14',

  // 错误色
  error: '#f5222f',

  // 系统基础配置，这些是数据库中保存起来的
  SYS_BASE_CONFIG: {
    // 默认logo
    SYSTEM_SYS_LOGO: '/img/logo.png',
    // 背景图
    SYSTEM_SYS_BACK_IMAGE: '',
    // 系统名称
    SYSTEM_SYS_NAME: 'IT综合运维管理平台',
    // 版本
    SYSTEM_SYS_VERSION: '2.0.0',
  },
};

export default DEFAULT_CONFIG;
