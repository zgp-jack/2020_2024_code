<!--  -->

<script>
import { mapState, } from 'vuex';
import { PermissionsClass, } from '@/views/project/common/index';
import { stringToArray, } from '@/utils/common';
import _ from 'lodash';
export default {
  components: {},
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
      ropdownLinkIcon: 'el-icon-caret-bottom',
    };
  },
  computed: {
    ...mapState('login', {
      MyID: v => {
        return Number(v.userInfo.id) || 0;
      },
      MyPermissions: v => {
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
    RenderButtonsItem() {
      const alteration = {
        name: '变更',
        code: 'alteration',
        permissionCode: [PermissionsClass.AllUsers],
      };
      const metting = {
        name: '会议',
        code: 'metting',
        permissionCode: [PermissionsClass.AllUsers],
      };
      const invoice = {
        name: '合同/发票',
        code: 'invoice',
        permissionCode: [PermissionsClass.AllUsers],
      };
      let options = [alteration, metting, invoice];
      const submit = {
        name: '提交确认',
        code: 'confirm',
        permissionCode: [PermissionsClass.ProjectPrincipal],
      };
      const confirmResult = {
        name: '确认结果',
        code: 'confirmResult',
        permissionCode: [PermissionsClass.ITBP],
      };
      const handle = {
        name: '处理任务',
        code: 'handle',
        permissionCode: [PermissionsClass.TaskPrincipalOrMember],
      };
      const replenish = {
        name: '任务补充',
        code: 'append',
        permissionCode: [PermissionsClass.TaskPrincipalOrMember],
      };
      const changeApplication = {
        name: '变更申请',
        code: 'changeApplication',
        permissionCode: [
          PermissionsClass.ProjectUsers,
          PermissionsClass.ProjectPrincipal,
          PermissionsClass.TaskPrincipal
        ],
      };
      const change = {
        name: '变更',
        code: 'change',
        permissionCode: [PermissionsClass.ProjectPrincipal],
      };
      switch (this.State) {
        case 'implement_start':
          if (this.IsPassed) {
            options = [...options, change];
          } else if (this.IsAudit) {
            options = [...options, handle];
          } else if (this.IsNotPassed || this.IsSave || this.IsDefaultChange) {
            options = [...options, changeApplication];
            if (this.HandelProgress_100) {
              options.push(replenish);
            } else {
              options.push(handle);
            }
          } else {
            options = [...options, handle];
          }
          break;
        // 实施结束待确认
        case 'implement_over':
          if (this.IsDefaultChange) {
            options = [...options, submit, replenish, changeApplication];
          } else if (this.IsPassed) {
            options = [...options, change];
          } else if (this.IsAudit) {
            options = [...options, submit, replenish];
          } else if (this.IsSave || this.IsNotPassed) {
            options = [...options, changeApplication];
            if (this.HandelProgress_100) {
              options.push(submit, replenish);
            } else {
              options.push(handle);
            }
          } else {
            options = [...options, submit, replenish];
          }

          break;
        case 'confirmResult':
          if (this.IsPassed) {
            options = [...options, change];
          } else if (this.IsAudit) {
            options = [...options, confirmResult];
          } else if (this.IsSave || this.IsDefaultChange) {
            options = [...options, confirmResult, changeApplication];
          } else {
            options = [...options, confirmResult, changeApplication];
          }
          break;
        // 确认结果 通过
        case 'endCompleted':
          options = [];
          break;
        // 确认结果 不通过
        case 'notCompleted':
          options = [];
          break;
        case 'item_before_project':
          // options = [confirmResult, changeApplication];
          options = [...options, confirmResult];

          break;
        default:
          options = [];
          break;
      }
      return options;
    },
  },
  mounted() {},
  methods: {
    emitClick(v) {
      this.$emit('click', v);
    },
  },
  render(h) {
    let renderPermissionsButtons = [];

    if (!this.onlyView) {
      for (const i of this.RenderButtonsItem) {
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
        } else {
          //
        }
        if (val) {
          renderPermissionsButtons.push(i);
        }
      }
    } else {
      renderPermissionsButtons = [
        {
          name: '变更',
          code: 'alteration',
          permissionCode: [PermissionsClass.AllUsers],
        },
        {
          name: '会议',
          code: 'metting',
          permissionCode: [PermissionsClass.AllUsers],
        }, {
          name: '合同/发票',
          code: 'invoice',
          permissionCode: [PermissionsClass.AllUsers],
        }];
    }

    let downItemButtons = [];
    downItemButtons = renderPermissionsButtons;
    let dropdown = [];
    let downs = [];

    if (downItemButtons.length) {
      downs = downItemButtons.map(e => {
        return h(
          'el-dropdown-item',
          {
            attrs: {
              command: e.code,
            },
            style: {
              'font-size': '16px',
              'line-height': '25px',
              padding: '0 15px',
            },
          },
          [
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  'justify-content': 'space-between',
                  'align-items': 'center',
                },
              },
              [
                h('span', {
                  domProps: {
                    innerHTML: e.name,
                  },
                  style: { 'margin-right': '10px', },
                }),
                h('svg-icon', {
                  props: {
                    iconClass: e.code,
                  },
                })
              ]
            )
          ]
        );
      });
      dropdown = h(
        'el-dropdown',
        {
          on: {
            command: v => {
              this.emitClick(v);
            },
            'visible-change': v => {
              v
                ? (this.ropdownLinkIcon = 'el-icon-caret-top')
                : (this.ropdownLinkIcon = 'el-icon-caret-bottom');
            },
          },
          style: {},
          props: {
            trigger: 'click',
          },
        },
        [
          h('el-button', {
            props: {
              type: 'text',
              size: 'mini',
            },
            style: {
              'font-size': '14px',
              padding: '3px 3px',
              'line-height': '14px',
              'border-radius': '2px',
              background: '#e3e9f7',
              color: '#4970d1',
            },
            domProps: {
              innerHTML: `<span class="dropdown-link-warp">操作 <i class="${this.ropdownLinkIcon}"></i></span>`,
            },
          }),
          h(
            'el-dropdown-menu',
            {
              slot: 'dropdown',
            },
            downs
          )
        ]
      );
    }

    return h('div', [dropdown]);
  },
};
</script>
<style lang="scss" scoped></style>
