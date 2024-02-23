
<script>
import { mapState, } from 'vuex';
export default {
  name: 'OptionsMenu',
  props: {
    payType: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      base: [],
    };
  },
  computed: {
    ...mapState('contract/index', ['optionsModel']),

    renderItem() {
      if (this.optionsModel === 'handle') {
        let btns = [];
        if (['1', '2'].includes(this.payType)) {
          btns = [{ text: '付款', code: 'pay', }];
        } else if (['3'].includes(this.payType)) {
          btns = [{ text: '查看', code: 'search', }];
        }
        return btns;
      } else {
        return [{ text: '删除', code: 'del', }];
      }
    },

  },
  methods: {
    emitClick(v) {
      this.$emit('click', v);
    },
  },
  render(h) {
    const btn = this.renderItem.map((e) => {
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

    return h('div', [
      btn

    ]);
  },
};
</script>

<style>
</style>
