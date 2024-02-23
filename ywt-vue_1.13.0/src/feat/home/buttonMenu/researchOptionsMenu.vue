
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
  },
  data() {
    return {
      ropdownLinkIcon: 'el-icon-caret-bottom',
    };
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
      MyPermissions: (v) => {
        return v.userInfo.permissions || [];
      },
      MyId: (v) => {
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
      // 调研成员
      const uers = data.users || '';
      return {
        uers,
        createUser,
        principal,
      };
    },
    IsCreateUser() {
      return this.Users.createUser === this.MyId ? PermissionsClass.DemandCreateUser : '';
    },
    // 调研成员
    Isuers() {
      if (this.Users.uers.includes(String(this.MyId))) {
        return PermissionsClass.InvestigateUser;
      }
      return '';
    },
    // 调研负责人
    IsPrincipal() {
      return this.Users.principal === this.MyId ? PermissionsClass.InvestigatePrincipal : '';
    },
    // 是否有审核权限
    IsITBP() {
      if (this.MyPermissions.includes('ITBP_MANAGER')) {
        return PermissionsClass.ITBP;
      }
      return '';
    },
    // 是否有调研分配权限
    IsAllocation() {
      if (this.MyPermissions.includes('DEMAND_ALLOCATION')) {
        return PermissionsClass.Allocation;
      }
      return '';
    },
    // 是否有暂停权限
    IsPause() {
      if (this.MyPermissions.includes('PAUSE')) {
        return PermissionsClass.Pause;
      }
      return '';
    },
    RenderItem() {
      const back = { text: '撤销', code: 'back', permissionsCode: [PermissionsClass.DemandCreateUser, PermissionsClass.ITBP], };
      const end = { text: '终止', code: 'end', permissionsCode: [PermissionsClass.DemandCreateUser, PermissionsClass.InvestigatePrincipal, PermissionsClass.ITBP], };
      const del = { text: '删除', code: 'del', permissionsCode: [PermissionsClass.DemandCreateUser, PermissionsClass.ITBP], };
      const toOrder = { text: '转工单', code: 'toOrder', permissionsCode: [PermissionsClass.InvestigatePrincipal, PermissionsClass.ITBP], };
      const assign = { text: '分配', code: 'distribute', permissionsCode: [PermissionsClass.Allocation], };
      const review = { text: '评审', code: 'review', dataCode: this.State, permissionsCode: [PermissionsClass.InvestigatePrincipal, PermissionsClass.ITBP], };
      const research = { text: '调研', code: 'research', permissionsCode: [PermissionsClass.InvestigatePrincipal, PermissionsClass.InvestigateUser, PermissionsClass.ITBP], };
      const edit = { text: '编辑', code: 'edit', permissionsCode: [PermissionsClass.DemandCreateUser, PermissionsClass.ITBP], };
      // 暂停
      const stop = { text: '暂停', code: 'pause', permissionsCode: [PermissionsClass.Pause], };
      // 开启
      const open = { text: '开启', code: 'open', permissionsCode: [PermissionsClass.Pause], };
      let arr = [];
      switch (this.State) {
        case 'demand_init':
          arr = [assign, end, toOrder, stop];
          break;
        case 'demand_inv_review':
          arr = [review, end, toOrder, stop];

          break;
        case 'demand_inv':
          arr = [research, end, toOrder, stop];
          break;
        case 'demand_inv_review_next':
          arr = [research, end, toOrder, stop];
          break;
        case null:
          arr = [edit, del];
          break;
        case 'item_establish':
          arr = [end, back, stop];
          break;
        case 'item_program_review':
          arr = [review, stop];
          if (this.IsPrincipal) {
            arr.push(edit, end, toOrder);
          } else {
            arr.push(end, toOrder);
          }
          break;
        case 'implement_start':
          arr = [end, back, stop];
          break;
        case 'program_review_reject':
          arr = [edit, end, toOrder, back, stop];
          break;
        case 'end_inv_reject':
          arr = [back, end, stop];
          break;
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
    const renderPermissionsButtons = [];

    for (const i of this.RenderItem) {
      let val = null;
      if (i.permissionsCode.includes(this.IsITBP)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsPrincipal)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsCreateUser)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsITEM_AUDIT)) {
        val = i;
      } else if (i.permissionsCode.includes(this.Isuers)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsAllocation)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsPause)) {
        val = i;
      }
      if (val) {
        renderPermissionsButtons.push(val);
      }
    }
    let downItemButtons = [];
    downItemButtons = renderPermissionsButtons;
    let dropdown = [];
    let downs = [];

    if (downItemButtons.length) {
      downs = downItemButtons.map((e) => {
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
            h('div', {
              style: {
                display: 'flex',
                'justify-content': 'space-between',
                'align-items': 'center',
              },
            }, [
              h('span', {
                domProps: {
                  innerHTML: e.text,
                },
                style: { 'margin-right': '10px', },
              }),
              h('svg-icon', {
                props: {
                  iconClass: e.code,
                },
              })

            ])
          ]
        );
      });
      dropdown = h(
        'el-dropdown',
        {
          on: {
            command: (v) => {
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

<style>
</style>
