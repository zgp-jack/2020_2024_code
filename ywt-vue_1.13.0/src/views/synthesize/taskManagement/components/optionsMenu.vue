
<script>
import { mapState, } from 'vuex';
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
      base: [
        { text: '终止', code: 'end', },
        {
          text: '转工单',
          code: 'toOrder',
        }
      ],
    };
  },
  computed: {
    ...mapState('login', ['userInfo']),
    // 当前登录账号是否是责任人
    isLeader() {
      // PS: 任务的处理 只能由当前的任务的负责人处理，该任务的上级的负责人也不能处理
      // return [(this.data.leaderUser), this.data.parentLeaderId].indexOf(Number(this.userInfo.id)) > -1
      //   ? 'leader'
      //   : '';
      return [this.data.leaderUser].indexOf(Number(this.userInfo.id)) > -1
        ? 'leader'
        : '';
    },
    // 当前登录账号是否是参与人员
    isJoinUser() {
      return this.data.partUser.join().includes(String(this.userInfo.id))
        ? 'join'
        : '';
    },
    // 当前登录账号是否是创建人员

    isCreateUser() {
      return Number(this.data.createUser) === Number(this.userInfo.id)
        ? 'create'
        : '';
    },
    // 当前登录账号是否是审核人
    isAuditUser() {
      return Number(this.data.auditUser) === Number(this.userInfo.id)
        ? 'audit'
        : '';
    },
    regText() {
      const all = [this.isLeader, this.isJoinUser, this.isCreateUser, this.isAuditUser].filter((e) => e);
      const allText = all.join('|');
      return allText;
    },
    renderItem() {
      let text = {};

      // //状态(0待提交1待处理2待审核3已驳回4已暂停5已停止6已完成)
      switch (String(this.data.states)) {
        // 待提交
        case '0':
          if (this.data.child) {
            text = [
              {
                text: '编辑',
                code: 'edit',
                permissionCode: ['create', 'leader'],
              },
              {
                text: '删除',
                code: 'del',
                permissionCode: ['create', 'leader'],
              }
            ];
          } else {
            text = [
              {
                text: '编辑',
                code: 'edit',
                permissionCode: ['create', 'leader'],
              },
              {
                text: '删除',
                code: 'del',
                permissionCode: ['create', 'leader'],

              },
              { text: '提交',
                code: 'submit',
                permissionCode: ['leader', 'create'],
              }
            ];
          }

          break;
        //  待处理
        case '1':
          // 存在子级
          // 1.判断 是否存在 子级 且 当前 是否是父节点  默认存在子级
          //

          if (this.data.child && this.data.parentId === undefined) {
            text = [
              {
                text: '添加子任务',
                code: 'addChild',
                permissionCode: ['create', 'leader', 'join'],
              },

              {
                text: '终止',
                code: 'end',
                permissionCode: ['create', 'leader'],

              }];
            // 在处理中

            if (!this.data.compRate) {
              text.push({
                text: '编辑',
                code: 'edit',
                permissionCode: ['create', 'leader'],
              },);
            }
          } else if (!this.data.child && this.data.parentId === undefined) {
            text = [{
              text: '处理',
              code: 'handle',
              permissionCode: ['leader', 'join'],

            }, {
              text: '添加子任务',
              code: 'addChild',
              permissionCode: ['leader', 'create', 'join'],

            },
            {
              text: '暂停',
              code: 'stop',
              permissionCode: ['leader'],

            },
            {
              text: '终止',
              code: 'end',
              permissionCode: ['leader', 'create'],

            },

            {
              text: '转交',
              code: 'passed',
              permissionCode: ['leader'],

            }];
            if (!this.data.compRate) {
              text.push({
                text: '编辑',
                code: 'edit',
                permissionCode: ['create', 'leader'],
              },);
            }
          } else if (this.data.child === undefined && this.data.parentId) {
            text = [{
              text: '处理',
              code: 'handle',
              permissionCode: ['leader', 'join'],

            }, {
              text: '暂停',
              code: 'stop',
              permissionCode: ['leader'],

            },
            {
              text: '终止',
              code: 'end',
              permissionCode: ['leader', 'create'],

            },
            {
              text: '转交',
              code: 'passed',
              permissionCode: ['leader'],

            }];
            if (!this.data.compRate) {
              text.push({
                text: '编辑',
                code: 'edit',
                permissionCode: ['create', 'leader'],
              },);
            }
          }

          break;
        // 待审核
        case '2':
          if (this.data.parentId) {
            text = [];
          } else {
            text = [{
              text: '审核',
              code: 'review',
              permissionCode: ['audit'],
            }
            ];
          }

          break;

        // 以驳回
        case '3':

          text = [{
            text: '终止',
            code: 'end',
            permissionCode: ['create', 'leader'],

          },
          {
            text: '暂停',
            code: 'stop',
            permissionCode: ['leader'],

          },
          {
            text: '转交',
            code: 'passed',
            permissionCode: ['leader'],

          }];
          if (!this.data.child && this.data.parentId === undefined) {
            text.unshift({
              text: '处理',
              code: 'handle',
              permissionCode: ['leader', 'join'],

            });
          }
          if (this.data.child === undefined && this.data.parentId) {
            text.unshift({
              text: '处理',
              code: 'handle',
              permissionCode: ['leader', 'join'],

            });
          }
          break;
        case '4':
          text = [{
            text: '开启',
            code: 'open',
            permissionCode: ['leader'],
          }];
          break;
        // 终止
        case '5':
          text = [];
          break;
        // 完成
        case '6':
          text = [];
          break;
        default:
          text = [];
      }
      return text;
    },
  },
  methods: {
    emitClick(v) {
      this.$emit('click', v);
    },
  },
  render(h) {
    const renderPermissionsButtons = [
      {
        text: '查看',
        code: 'search',
      }
    ];

    for (const i of this.renderItem) {
      let val = null;
      if (i.permissionCode.includes(this.isLeader)) {
        val = i;
      } else if (i.permissionCode.includes(this.isCreateUser)) {
        val = i;
      } else if (i.permissionCode.includes(this.isJoinUser)) {
        val = i;
      } else if (i.permissionCode.includes(this.isAuditUser)) {
        val = i;
      }
      if (val) {
        renderPermissionsButtons.push(val);
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

<style>
</style>
