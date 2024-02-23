<script>
import { mapState, } from 'vuex';
import { PermissionsClass, } from '@/views/project/common/index';
export default {
  name: 'OptionsMenu',
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
  },
  data() {
    return {};
  },
  //   0: {value: "demand_init", name: "待分配"}
  // 1: {value: "demand_inv", name: "调研中"}
  // 2: {value: "demand_inv_review", name: "调研评审"}
  // 3: {value: "end_inv_reject", name: "调研评审不通过"}
  // 4: {value: "end_project_order", name: "转工单"}
  // 5: {value: "demand_inv_review_next", name: "继续调研"}
  // 6: {value: "item_establish", name: "已立项"}
  // 7: {value: "item_program_review", name: "方案评审"}
  // 8: {value: "implement_start", name: "项目实施"}
  // 9: {value: "item_before_project", name: "项目结束"}
  computed: {
    ...mapState('login', {
      MyId: v => {
        return Number(v.userInfo.id) || 0;
      },
    }),

    State() {
      return this.data.showState;
    },
    Data() {
      return this.data;
    },
    Users() {
      const data = this.Data;
      const createUser = data.createUser;
      const principal = data.principal;
      const joinUser = data.joinUser || '';
      const taskUsers = data.users || '';
      const reviewUser = data.reviewer || '';
      const operateUser = data.updateUser || '';
      return {
        joinUser,
        taskUsers,
        createUser,
        principal,
        reviewUser,
        operateUser,
      };
    },
    IsRviewer() {
      return this.Users.reviewUser === this.MyId ? PermissionsClass.ProjectReviewUser : '';
    },
    IsCreateUser() {
      return this.Users.createUser === this.MyId ? PermissionsClass.ProjectCreateUser : '';
    },
    IsJoinUser() {
      if (this.Users.joinUser.includes(String(this.MyId))) {
        return PermissionsClass.ProjectUsers;
      }
      return '';
    },
    IsPrincipal() {
      return this.Users.principal === this.MyId ? PermissionsClass.ProjectPrincipal : '';
    },
    IsTaskUser() {
      if (this.Users.taskUsers.includes(String(this.MyId))) {
        return PermissionsClass.TaskMember;
      }
      return '';
    },
    IsOperateUser() {
      if (this.Users.operateUser === this.MyId) {
        return PermissionsClass.OperateUser;
      }
      return '';
    },
    ...mapState('login', {
      MyPermissions: (v) => {
        return v.userInfo.permissions || [];
      },
    }),
    // 是否有暂停权限
    IsPause() {
      if (this.MyPermissions.includes('PAUSE') && this.IsPrincipal) {
        return PermissionsClass.Pause;
      }
      return '';
    },

    renderItem() {
      const back = { text: '撤销', code: 'back', permissionsCode: [PermissionsClass.OperateUser], };
      const end = { text: '终止', code: 'end', permissionsCode: [PermissionsClass.ProjectCreateUser, PermissionsClass.ProjectPrincipal], };
      const del = { text: '删除', code: 'del', permissionsCode: [PermissionsClass.ProjectCreateUser, PermissionsClass.ProjectPrincipal], };
      const edit = { text: '编辑', code: 'edit', permissionsCode: [PermissionsClass.ProjectCreateUser, PermissionsClass.ProjectPrincipal, PermissionsClass.ProjectUsers, PermissionsClass.TaskMember], };
      const formulate = { text: '任务制定', code: 'set', permissionsCode: [PermissionsClass.ProjectCreateUser, PermissionsClass.ProjectPrincipal, PermissionsClass.ProjectUsers, PermissionsClass.TaskMember], };
      const confirmResult = { text: '确认结果', code: 'confirm', permissionsCode: [PermissionsClass.ProjectPrincipal], };
      const review = { text: '评审', code: 'review', permissionsCode: [PermissionsClass.ProjectReviewUser], dataCode: this.State, };
      // 暂停
      const stop = { text: '暂停', code: 'pause', permissionsCode: [PermissionsClass.Pause], };
      // 开启
      const open = { text: '开启', code: 'open', permissionsCode: [PermissionsClass.Pause], };

      let arr = [];
      switch (this.State) {
        case null:
          arr = [edit, del];
          break;
        case 'item_establish':
          arr = [formulate, end, stop];
          break;
          // 方案评审
        case 'item_program_review':
          arr = [review, end, stop];
          break;
          // 项目实施
        case 'implement_start':
          arr = [back, end];
          break;
          // 未通过 方案评审
        case 'program_review_reject':
          arr = [formulate, back, end, stop];
          break;
        case 'item_before_project':
          arr = [confirmResult, stop];
          break;
        case 'implement_over':
          arr = [confirmResult, stop];
          break;
          // 调研评审不通过
        case 'end_inv_reject':
          arr = [back, end, stop];
          break;
          // 转工单
        case 'end_project_order':
          arr = [back, end, stop];
          break;
        case 'demand_pause':
          arr = [open, end];

          break;
        default:
          arr = [];
      }
      return arr;
    },

  },
  methods: {
    emitClick(v) {
      this.$emit('click', v);
    },
  },
  render(h) {
    const look = { text: '查看', code: 'search', permissionsCode: ['all'], };

    const renderPermissionsButtons = [look];
    if (!this.onlyView) {
      for (const i of this.renderItem) {
        let val = null;
        if (i.permissionsCode.includes(this.IsPrincipal)) {
          val = i;
        } else if (i.permissionsCode.includes(this.IsCreateUser)) {
          val = i;
        } else if (i.permissionsCode.includes(this.IsJoinUser)) {
          val = i;
        } else if (i.permissionsCode.includes(this.IsTaskUser)) {
          val = i;
        } else if (i.permissionsCode.includes(this.IsRviewer)) {
          val = i;
        } else if (i.permissionsCode.includes(this.IsOperateUser)) {
          val = i;
        } else if (i.permissionsCode.includes(this.IsPause)) {
          val = i;
        }
        if (val) {
          renderPermissionsButtons.push(val);
        }
      }
    }
    let baseButtons = []; let downItemButtons = [];
    if (renderPermissionsButtons.length > 3) {
      baseButtons = renderPermissionsButtons.slice(0, 2);
      downItemButtons = renderPermissionsButtons.slice(2);
    } else {
      baseButtons = renderPermissionsButtons.slice(0, 3);
      downItemButtons = renderPermissionsButtons.slice(3);
    }
    let dropdown = [];
    const _b = baseButtons.map((e) => {
      return h('el-button', {
        props: {
          type: 'text',
        },
        domProps: {
          innerHTML: e.text,
        },
        on: {
          click: () => {
            this.emitClick(e.code);
          },
        },
      });
    });
    if (downItemButtons.length) {
      const downs = downItemButtons.map((e) => {
        return h('el-dropdown-item', {
          domProps: {
            innerHTML: e.text,
          },
          attrs: {
            command: e.code,
          },
        });
      });
      dropdown = h(
        'el-dropdown',
        {
          on: {
            command: (v) => {
              this.emitClick(v);
            },
          },
          style: {
            'margin-left': '10px',
          },
        },
        [
          h('el-button', {
            props: {
              type: 'text',
            },
            domProps: {
              innerHTML: '更多 <i   class="el-icon-arrow-down "></i>',
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

    return h('div', [_b, dropdown]);
  },
};
</script>

<style></style>
