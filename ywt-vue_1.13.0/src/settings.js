/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 14:45:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-15 11:21:32
 * @Description: Vue 默认设置
 */
module.exports = {
  title: '后勤管理系统',
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
    * @type {boolean} true | false
    * @description Whether need tagsView
    */
  tagsView: true,

  /**
    * @type {boolean} true | false
    * @description Whether fix the header
    */
  fixedHeader: false,

  /**
    * @type {boolean} true | false
    * @description Whether show the logo in sidebar
    */
  sidebarLogo: true,

  /**
    * @type {string | array} 'production' | ['production', 'development']
    * @description Need show err logs component.
    * The default is only used in the production env
    * If you want to also use it in dev, you can pass ['production', 'development']
    */
  errorLog: 'production',
};
