
<script>
export default {
  name: 'ChildOptionsMenu',
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    options: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      base: [],
    };
  },
  computed: {
    renderItem() {
      let text = {};
      switch (this.options) {
        case 'edit':
          text = {
            base: [
              {
                text: '编辑',
                code: 'edit',
              }, {
                text: '删除',
                code: 'del',
              }, {
                text: '查看',
                code: 'search',
              }
            ],
            children: [],
          };
          break;
        default:
          text = {
            base: [],
            children: [],

          };
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
    let Buttons = [];
    let dropdown = [];
    if (this.renderItem.base.length) {
      Buttons = this.renderItem.base.map((e) => {
        return h('el-button', {
          props: {
            type: 'text',
          },
          attrs: {
            'data-code': e.dataCode || '',
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
    }

    if (this.renderItem.children.length) {
      const dropdownItem = this.renderItem.children.map((e) => {
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
          h(
            'el-button',
            {
              props: {
                type: 'text',
              },
              domProps: {
                innerHTML: '更多 <i   class="el-icon-arrow-down "></i>',
              },
            },
          ),
          h(
            'el-dropdown-menu',
            {
              slot: 'dropdown',
            },
            dropdownItem
          )
        ]
      );
    }

    return h('div', [
      // base,
      Buttons,
      dropdown
    ]);
  },
};
</script>

<style>
</style>
