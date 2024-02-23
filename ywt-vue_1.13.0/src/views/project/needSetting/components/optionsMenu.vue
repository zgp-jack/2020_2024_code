
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
      const handlerUser = data?.handlerUser || '';
      // 技术分析成员
      const technicalAnalysisUsers = data.analystTechnical || '';
      return {
        uers,
        createUser,
        principal,
        handlerUser,
        technicalAnalysisUsers,
      };
    },
    IsCreateUser() {
      return this.Users.createUser === this.MyId ? PermissionsClass.DemandCreateUser : '';
    },
    // 调研成员
    IsUsers() {
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
    // 是否有需求评审权限
    IsDemandReview() {
      if (this.MyPermissions.includes('DEMAND_REVIEW')) {
        return PermissionsClass.DemandReview;
      }
      return '';
    },
    // 是否是上一步的操作人
    IsBeforeHandlerUser() {
      return this.Users.handlerUser === this.MyId ? PermissionsClass.BeforeHandlerUser : '';
    },
    // 技术分析人
    IsTechnicalAnalysis() {
      return this.Users.technicalAnalysisUsers.includes(this.MyId) ? PermissionsClass.TechnicalAnalysis : '';
    },
    // 是否有暂停权限
    IsPause() {
      if (this.MyPermissions.includes('PAUSE')) {
        // 调研负责人不存在 取创建者
        if (!this.Users.principal && this.IsCreateUser) {
          return PermissionsClass.Pause;
        } else if (this.Users.principal && this.IsPrincipal) {
        // 调研负责人存在 取调研负责人
          return PermissionsClass.Pause;
        } else {
          return '';
        }
      }
      return '';
    },
    RenderItem() {
      //   调研、需求分析、需求评估，这几个操作的操作人为“调研负责人”“调研成员”“ITBP”
      // 技术分析，这个操作的的操作人为“技术分析人”“ITBP”
      // 初定级，这个操作的操作人为“ITBP”
      // 终止、转工单、撤销，这几个操作的操作人为“ITBP”
      // 以上操作，创建人也有。
      // 撤销除了“ITBP”“创建人”外，还有上一步执行该操作的操作人，即谁提交谁撤销。例如，调研信息填写完毕，张三提交了调研，使得需求进入初定级，假设有撤销操作，那张三才可撤销此步骤，让需求回到待调研状态。
      const back = { text: '撤销', code: 'back', permissionsCode: [PermissionsClass.DemandCreateUser, PermissionsClass.ITBP], };
      const end = { text: '终止', code: 'end', permissionsCode: [PermissionsClass.DemandCreateUser, PermissionsClass.ITBP], };
      const del = { text: '删除', code: 'del', permissionsCode: [PermissionsClass.DemandCreateUser, PermissionsClass.ITBP], };
      const toOrder = { text: '转工单', code: 'toOrder', permissionsCode: [PermissionsClass.DemandCreateUser, PermissionsClass.ITBP], };
      const assign = { text: '分配', code: 'distribute', permissionsCode: [PermissionsClass.Allocation], };
      const review = { text: '评审', code: 'review', dataCode: this.State, permissionsCode: [PermissionsClass.InvestigatePrincipal, PermissionsClass.ITBP], };
      const research = { text: '调研', code: 'research', permissionsCode: [PermissionsClass.InvestigatePrincipal, PermissionsClass.InvestigateUser, PermissionsClass.ITBP, PermissionsClass.DemandCreateUser], };
      const edit = { text: '编辑', code: 'edit', permissionsCode: [PermissionsClass.DemandCreateUser, PermissionsClass.ITBP], };
      const demandAnalysis = { text: '需求分析', code: 'demandAnalysis', permissionsCode: [PermissionsClass.InvestigatePrincipal, PermissionsClass.InvestigateUser, PermissionsClass.ITBP, PermissionsClass.DemandCreateUser], };
      const technicalAnalysis = { text: '技术分析', code: 'technicalAnalysis', permissionsCode: [PermissionsClass.ITBP, PermissionsClass.DemandCreateUser, PermissionsClass.TechnicalAnalysis], };
      const demandAssess = { text: '需求评估', code: 'demandAssess', permissionsCode: [PermissionsClass.InvestigatePrincipal, PermissionsClass.InvestigateUser, PermissionsClass.ITBP, PermissionsClass.DemandCreateUser], };
      const demandReview = { text: '方案评审', code: 'demandReview', permissionsCode: [PermissionsClass.DemandReview], };
      // 初定级
      const preliminaryLevel = { text: '初定级', code: 'preliminaryLevel', permissionsCode: [PermissionsClass.ITBP, PermissionsClass.DemandCreateUser], };
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
          arr = [demandReview, back, end, toOrder, stop];
          break;
        // 初定级
        case 'WAIT_GRADING':
          arr = [preliminaryLevel, end, toOrder, stop];
          break;
        // 待需求分析
        case 'demand_analysis':
          arr = [demandAnalysis, back, end, toOrder, stop];
          break;
        // 待技术分析
        case 'technical_analysis':
          arr = [technicalAnalysis, back, end, toOrder, stop];
          break;
          // 待需求评估
        case 'demand_assess':
          arr = [demandAssess, back, end, stop];
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
        case 'end_assess_reject':
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
      } else if (i.permissionsCode.includes(this.IsUsers)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsAllocation)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsDemandReview)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsBeforeHandlerUser)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsTechnicalAnalysis)) {
        val = i;
      } else if (i.permissionsCode.includes(this.IsPause)) {
        val = i;
      }
      if (val) {
        renderPermissionsButtons.push(val);
      }
    }
    let baseButtons = [];
    let downItemButtons = [];
    if (renderPermissionsButtons.length <= 3) {
      baseButtons = renderPermissionsButtons.slice(0, 3);
    } else if (renderPermissionsButtons.length > 3) {
      baseButtons = renderPermissionsButtons.slice(0, 2);
      downItemButtons = renderPermissionsButtons.slice(2);
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

<style>
</style>
