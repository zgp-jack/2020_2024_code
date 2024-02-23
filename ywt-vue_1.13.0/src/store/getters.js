/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 17:10:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 13:57:25
 * @Description:
 */
const getters = {
  permission_routes: state => state.permission.addRoutes,
  userInfo: state => state.login.userInfo,
  onlineList: state => state.ticketServiceDesk.onlineList,
  socketStatus: state => state.ticketServiceDesk.socketStatus,
  phoneList: state => state.ticketServiceDesk.phoneList,
  errorLogs: state => state.errorLog.logs,
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  avatar: state => state.login.userInfo.avatar,
  device: state => state.tagsView.visitedViews,
  fileBaseUrl: state => state.login.uriConfig.fileBaseUri || '',
};

export default getters;
