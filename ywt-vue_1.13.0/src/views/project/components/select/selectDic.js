import { mapState, } from 'vuex';

export default {
  name: 'HyySelectDic',
  props: {
    dicKey: {
      type: String,
      required: true,
      default: '',
    },
    value: {
      type: [String, Number, Array],
      default: '',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    // 是否显示默认值 默认显示
    defaultValue: {
      type: Boolean,
      default: true,
    },
    multiple: Boolean,
    disabled: Boolean,
  },
  computed: {
    ...mapState(['dictionary']),
    dicData() {
      return this.dictionary[this.dicKey];
    },
  },
  created() {
    if (this.defaultValue) {
      if (!this.value) {
        this.$emit('input', this.dicData[0].value);
      }
    }
  },
  render(h) {
    const self = this;
    // 判断值是否是 数字 小数
    const reg = /^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$/;

    const items = this.dicData.map((e) => {
      return h('el-option', {
        props: {
          label: e.name,
          value: reg.test(e.value) ? Number(e.value) : e.value,
        },
      });
    });
    let value = '';
    if (self.value instanceof Array) {
      value = self.value;
    } else if (self.value === '') {
      value = self.value;
    } else if (reg.test(self.value)) {
      value = Number(self.value);
    } else {
      value = self.value;
    }
    return h('el-select', {
      props: {
        value: value,
        filterable: true,
        placeholder: self.placeholder,
        multiple: self.multiple,
        clearable: true,
        disabled: self.disabled,
        ...this.$attrs,
      },
      style: {
        width: '100%',
      },
      on: {
        change: (v) => {
          self.$emit('input', v);
          self.$emit('change', v);
        },
        clear: () => {
          self.$emit('input', '');
          self.$emit('change', '');
        },
      },
    }, items);
  },
};
