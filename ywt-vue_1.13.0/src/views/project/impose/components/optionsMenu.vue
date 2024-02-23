<!--  -->

<script>
import { mapState, } from 'vuex';
import { PermissionsClass, } from '@/views/project/common/index';
import { stringToArray, } from '@/utils/common';
import _ from 'lodash';
import OptionButton from '@/views/project/components/button/optionButton.vue';
export default {
  components: {
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    onlyView: {
      type: Boolean,
      default: false,
    },
    processPanelCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapState('login', {
      MyID: (v) => {
        return Number(v.userInfo.id) || 0;
      },
      MyPermissions: (v) => {
        return v.userInfo.permissions || [];
      },
    }),

    State() {
      return this.processPanelCode || this.data.showState;
    },

    // 处理进度
    HandelProgress_100() {
      return this.data?.totalProgress === 100;
    },
    Users() {
      const principal = this.data.principal;
      // 项目参与人员
      const joinUsers = stringToArray(this.data.joinUser);
      // 任务人员
      const taskUsers = stringToArray(this.data.taskUsers);
      // 任务负责人
      const taskPrincipal = stringToArray(this.data.taskPrincipals);
      return {
        principal,
        joinUsers,
        taskUsers,
        taskPrincipal,
      };
    },
    AllUsers() {
      const value = _.flattenDeep(Object.values(this.Users));
      const users = _.uniq(value.map(Number));
      return users;
    },
    IsInUsers() {
      if (this.AllUsers.includes(this.MyID)) {
        return PermissionsClass.AllUsers;
      }
      return '';
    },
    // 是否是 任务的负责人 或 任务的参与人
    IsTaskPrincipalOrTaskJoin() {
      if (this.Users.taskUsers.includes(this.MyID)) {
        return PermissionsClass.TaskPrincipalOrMember;
      }
      return '';
    },
    IsProjectPrincipal() {
      if (this.Users.principal === this.MyID) {
        return PermissionsClass.ProjectPrincipal;
      }
      return '';
    },
    IsITBP() {
      if (this.MyPermissions.includes('ITBP_MANAGER')) {
        return PermissionsClass.ITBP;
      }
      return '';
    },
    // 确认结果
    IsConfirmResult() {
      // console.log(this.MyPermissions, 'MyPermissions');
      if (this.MyPermissions.includes('IMPL_RESULT_CONFIRM')) {
        return PermissionsClass.ConfirmResult;
      }
      return '';
    },
    IsProjectUsers() {
      if (this.Users.joinUsers.includes(this.MyID)) {
        return PermissionsClass.ProjectUsers;
      }
      return '';
    },
    // 是否是任务负责人
    IsTaskPrincipal() {
      if (this.Users.taskPrincipal.includes(this.MyID)) {
        return PermissionsClass.TaskPrincipal;
      }
      return '';
    },
    // 待审核
    IsAudit() {
      return [1].includes(this.data.applyAudit);
    },
    // 已通过
    IsPassed() {
      //  变更申请 状态1、待审核，2、已通过 3、未通过 5、已保存
      return [2].includes(this.data.applyAudit);
    },
    // 未通过
    IsNotPassed() {
      return [3].includes(this.data.applyAudit);
    },
    // 已保存
    IsSave() {
      return [5].includes(this.data.applyAudit);
    },
    // 默认没有发起变更申请
    IsDefaultChange() {
      return !this.data.applyAudit;
    },
    IsPrincipal() {
      console.log(this.Users.principal, this.data.title, this.MyID);

      return this.Users.principal === this.MyID ? PermissionsClass.ProjectPrincipal : '';
    },
    // 是否有暂停权限
    IsPause() {
      if (this.MyPermissions.includes('PAUSE') && this.IsPrincipal) {
        return PermissionsClass.Pause;
      }
      return '';
    },
    // 终止
    IsTermination() {
      if (this.MyPermissions.includes('ITEM_IMPL_TERMINATE') && this.IsPrincipal) {
        return PermissionsClass.Termination;
      }
      return '';
    },
    RenderButtonsItem() {
      let options = [];

      const submit = { name: '提交确认', zIndex: 10, code: 'confirm', permissionCode: [PermissionsClass.ProjectPrincipal, PermissionsClass.ProjectUsers, PermissionsClass.TaskPrincipalOrMember], };
      const generateReport = { name: '生成报告', zIndex: 9, code: 'generateReport', permissionCode: [PermissionsClass.ProjectPrincipal, PermissionsClass.ITBP], };
      const confirmResult = { name: '确认结果', zIndex: 8, code: 'confirmResult', permissionCode: [PermissionsClass.ConfirmResult], };
      const handle = { name: '处理任务', zIndex: 1, code: 'handle', permissionCode: [PermissionsClass.TaskPrincipalOrMember], };
      const replenish = { name: '任务补充', zIndex: 6, code: 'append', permissionCode: [PermissionsClass.TaskPrincipalOrMember], };
      const changeApplication = { name: '变更申请', zIndex: 2, code: 'changeApplication', permissionCode: [PermissionsClass.ProjectUsers, PermissionsClass.ProjectPrincipal, PermissionsClass.TaskPrincipal], };
      const change = { name: '变更', code: 'change', zIndex: 2, permissionCode: [PermissionsClass.ProjectPrincipal], };
      const summary = { name: '项目总结', zIndex: 4, code: 'summary', permissionCode: [PermissionsClass.ProjectPrincipal], };
      const weekly = { name: '项目周报', zIndex: 5, code: 'weekly', permissionCode: [PermissionsClass.ProjectPrincipal], };

      // 暂停
      const pause = { name: '暂停', zIndex: 3, code: 'pause', permissionCode: [PermissionsClass.Pause], };
      // 开启
      const open = { name: '开启', zIndex: 3, code: 'open', permissionCode: [PermissionsClass.Pause], };

      //
      const termination = { name: '终止', zIndex: 3, code: 'termination', permissionCode: [PermissionsClass.Termination], };
      const restart = { name: '重启', zIndex: 3, code: 'restart', permissionCode: [PermissionsClass.Termination], };
      console.log(this.State);

      switch (this.State) {
        case 'implement_start':

          if (this.IsPassed) {
            options = [change];
          } else if (this.IsAudit) {
            options = [handle];
          } else if (this.IsNotPassed || this.IsSave || this.IsDefaultChange) {
            options = [changeApplication];
            if (this.HandelProgress_100) {
              options.push(replenish);
            } else {
              options.push(handle);
            }
          } else {
            options = [handle];
          }
          options.push(termination, pause, summary, weekly);
          break;
          // 实施结束待确认
        case 'implement_over':
          if (this.IsDefaultChange) {
            options = [submit, replenish, changeApplication];
          } else if (this.IsPassed) {
            options = [change];
          } else if (this.IsAudit) {
            options = [submit, replenish];
          } else if (this.IsSave || this.IsNotPassed) {
            options = [changeApplication];
            if (this.HandelProgress_100) {
              options.push(submit, replenish);
            } else {
              options.push(handle);
            }
          } else {
            options = [submit, replenish];
          }

          break;
        case 'confirmResult':
          if (this.IsPassed) {
            options = [change];
          } else if (this.IsAudit) {
            options = [confirmResult];
          } else if (this.IsSave || this.IsDefaultChange) {
            options = [confirmResult, changeApplication];
          } else {
            options = [confirmResult, changeApplication];
          }
          break;
          // 确认结果 通过
        case 'endCompleted':
          options = [generateReport];
          break;
          // 确认结果 不通过
        case 'notCompleted':
          options = [];
          break;
        case 'item_before_project':
          // options = [confirmResult, changeApplication];
          options = [confirmResult];

          break;
        // 开启
        case 'demand_pause':
          options = [open];
          break;
        // 重启
        case 'implement_terminate':
          options = [restart];
          break;
        default:
          options = [];
          break;
      }
      return options;
    },
  },
  mounted() {
  },
  methods: {
  },
  render(h) {
    console.log(this.RenderButtonsItem, this.data.title, 'RenderButtonsItem');
    const buttons = [];
    if (!this.onlyView) {
      for (const i of this.RenderButtonsItem) {
        // console.log(i.permissionCode, this.data.title, 'permissionCode');

        let val = null;
        if (i.permissionCode.includes(this.IsTaskPrincipalOrTaskJoin)) {
          val = i;
        } else if (i.permissionCode.includes(this.IsProjectPrincipal)) {
          val = i;
        } else if (i.permissionCode.includes(this.IsInUsers)) {
          val = i;
        } else if (i.permissionCode.includes(this.IsITBP)) {
          val = i;
        } else if (i.permissionCode.includes(this.IsProjectUsers)) {
          val = i;
        } else if (i.permissionCode.includes(this.IsTaskPrincipal)) {
          val = i;
        } else if (i.permissionCode.includes(this.IsConfirmResult)) {
          val = i;
        } else if (i.permissionCode.includes(this.IsPause)) {
          val = i;
        } else if (i.permissionCode.includes(this.IsTermination)) {
          val = i;
        }
        if (val) {
          buttons.push(i);
        }
      }
    }
    const look = { name: '查看', zIndex: 0, code: 'searh', };
    buttons.unshift(look);
    buttons.sort((a, b) => {
      return a.zIndex - b.zIndex;
    });
    return h(OptionButton, {
      props: {
        buttonList: buttons,
      },
      on: {
        click: (e) => {
          this.$emit('click', e);
        },
      },
    });
  },
};
</script>
<style lang='scss' scoped>
</style>
