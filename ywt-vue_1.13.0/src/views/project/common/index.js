import vm from '@/main';
import { Message, } from 'element-ui';

const h = vm.$createElement;
/**
 *
 * @表格图标 {*} icon
 * @附件数量 {*} badgeNum
 * @数据 {*} data
 * @组件名称 {*} componentName
 * @弹窗标题 {*} title
 */
export const tableCellIconData = function (icon, badgeNum, data, component, title) {
  if (!component) {
    console.error('请传入组件名称');
  }
  if (!title) {
    console.error('请传入弹窗标题');
  }
  return h('div', {
    style: {
      position: 'absolute',
      top: '40%',
      left: '40%',
    },
    on: {
      click: () => {
        if (!badgeNum) {
          return Message.warning('无数据!');
        }
        vm.$dialog({
          title: title,
          position: 'center',
          width: '688px',
          component: () => {
            return h(component, {
              props: {
                data: data,
              },
            });
          },
        });
      },

    },
  }, [vm.$createElement('el-badge', {
    props: {
      value: badgeNum || '',
    },
    style: {
    },
  }, [
    vm.$createElement('img', {
      attrs: {
        src: icon,
      },
      style: {
        width: '16px',
        height: '16px',
      },
    })
  ])
  ]);
};

export const tableCellIconDataDrawer = function (icon, badgeNum, data, component, title, width) {
  if (!component) {
    console.error('请传入组件名称');
  }
  if (!title) {
    console.error('请传入弹窗标题');
  }
  return h('div', {
    style: {
      position: 'absolute',
      top: '40%',
      left: '40%',
    },
    on: {
      click: () => {
        // if (!badgeNum) {
        //   return Message.warning('无数据!');
        // }
        vm.$drawer({
          title: title,
          width: width,
          component: () => {
            return h(component, {
              props: {
                data: data,
              },
            });
          },
        });
      },

    },
  }, [vm.$createElement('el-badge', {
    props: {
      value: badgeNum || '',
    },
    style: {
    },
  }, [
    vm.$createElement('img', {
      attrs: {
        src: icon,
      },
      style: {
        width: '16px',
        height: '16px',
      },
    })
  ])
  ]);
};

export const PermissionsClass = {
  /**
  * 需求创建人
  * */
  DemandCreateUser: 'DemandCreateUser',
  /**
  * 调研负责人
  * */
  InvestigatePrincipal: 'InvestigatePrincipal',
  /**
  * 调研参与人
  * */
  InvestigateUser: 'InvestigateUser',
  /**
  * 项目负责人
  * */
  ProjectPrincipal: 'ProjectPrincipal',
  /**
  *  项目创建人
  * */
  ProjectCreateUser: 'ProjectCreateUser',
  /**
  * 项目审核人
  * */
  ProjectReviewUser: 'ProjectReviewUser',
  /**
  * 项目参与人
  * */
  ProjectUsers: 'ProjectUsers',
  /**
  * 任务负责人
  * */
  TaskPrincipal: 'TaskPrincipal',
  /**
  * 任务成员
  * */
  TaskMember: 'TaskMember',
  /**
  * 任务负责人 +任务成员
  * */
  TaskPrincipalOrMember: 'TaskPrincipalOrMember',
  /**
  * 所有人
  * */
  AllUsers: 'AllUsers',
  /**
  * ITBP 成员
  * */
  ITBP: 'ITBP',
  /**
   *
   */
  ConfirmResult: 'ConfirmResult',
  /**
   * 操作人
   */
  OperateUser: 'OperateUser',
  /**
   * 分配调研
   */
  Allocation: 'Allocation',
  /**
   * 需求评审
   */
  DemandReview: 'DemandReview',
  /**
   * 初定级
   */
  PreliminaryLevel: 'PreliminaryLevel',
  /**
   * 技术分析人
   */
  TechnicalAnalysis: 'TechnicalAnalysis',
  /**
   * 上一步操作人
   */
  BeforeHandlerUser: 'BeforeHandlerUser',
  /**
   * 暂停
   */
  Pause: 'Pause',
  /**
   * 终止
   */
  Termination: 'Termination',

};
