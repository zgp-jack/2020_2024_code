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
      ropdownLinkIcon: 'el-icon-caret-bottom',
    };
  },
  computed: {
    ...mapState('login', ['userInfo']),
    // 当前登录账号是否是责任人
    renderItem() {
      let text = {};
      switch (String(this.data.currState)) {
        // 待接单
        case 'wait_accept':
          text = [
            {
              text: '接单',
              code: 'accept',
            },
            {
              text: '退回',
              code: 'sendBack',
            }
          ];
          break;
        case 'processing':
          text = [
            {
              text: '处理',
              code: 'complete',
            }
          ];
          break;
        case 'not_pass_audit':
          text = [
            {
              text: '处理',
              code: 'complete',
            }
          ];
          break;
        case 'suspended':
          text = [
            {
              text: '开启',
              code: 'openSuspended',
            }
          ];
          break;
        case 'terminated':
          text = [
            {
              text: '重启',
              code: 'restartTerminated',
            }
          ];
          break;
        case 'wait_audit':
          text = [
            {
              text: '通过',
              code: 'passAudit',
            },
            {
              text: '未通过',
              code: 'notPassAudit',
            }
          ];
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
    const renderPermissionsButtons = [];

    for (const i of this.renderItem) {
      renderPermissionsButtons.push(i);
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
                    innerHTML: e.text,
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

<style>
.dropdown-link-warp {
  cursor: pointer;
  font-size: 14px;
  padding: 1px 3px;
  line-height: 14px;
  background: #f0f1f5;
  border-radius: 2px;
}
</style>
