
/**
 *    说明:当组件默认slot数量大于3(默认3个), 会对slot内容分割处理
 *
 *    使用:
 *    <more-button>
 *      <el-button>1</el-button>
 *      <el-button>2</el-button>
 *      <el-button>3</el-button>
 *      <el-button>4</el-button>
 *    </more-button>
 */
export default {
  name: 'PureMoreButton',
  props: {
    /**
     * slot 数量超过多少,才被转换为《更多下拉列表》
     */
    sliceNumber: {
      type: Number,
      default: 3,
    },
  },
  render(h) {
    const defaultSlotEl = this.$slots.default;
    let baseButtons = [];
    let downItemButtons = [];
    if (defaultSlotEl?.length) {
      // 存在的按钮
      const existButtons = defaultSlotEl.filter((item) => {
        if (item.tag) {
          return item;
        }
      });
      const sliceNumber = this.sliceNumber || 0;
      if (existButtons.length <= sliceNumber) {
        baseButtons = existButtons.slice(0, sliceNumber);
      } else {
        baseButtons = existButtons.slice(0, sliceNumber - 1);
        downItemButtons = existButtons.slice(sliceNumber - 1);
      }
      let dropdown = [];
      if (downItemButtons.length) {
        const dropdownItem = downItemButtons.map((e) => {
          return h('el-dropdown-item', {}, [e,
          ]);
        });
        dropdown = h(
          'el-dropdown',
          {
            style: {
              'margin-left': '10px',
            },
          },
          [
            h('pure-button', {
              props: {
                type: 'text',
              },
              domProps: {
                innerHTML: '更多 <i class="el-icon-arrow-down"></i>',
              },
            }),
            h(
              'el-dropdown-menu',
              {
                slot: 'dropdown',
              },
              dropdownItem
            ),
          ]
        );
      }
      return h('div', [baseButtons, dropdown,
      ]);
    }
    return h(defaultSlotEl);
  },
};

