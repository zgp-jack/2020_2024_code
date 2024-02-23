import { arrayToString, stringToArray, } from '@/utils/common';
import _ from 'lodash';
import { mapActions, mapState, } from 'vuex';

export default {
  name: 'hyySelect',
  props: {
    multiple: {
      type: Boolean,
    },
    value: {
      type: [String, Number, Array],
      default: () => {
        return '';
      },
    },
    disabledValue: {
      type: [Number, String, Array],
      default: 0,
    },
    placeholder: String,
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    SelectPanel: () => import('../userSelect/select.vue'),
  },
  data() {
    return {
      inputText: '',
    };
  },
  computed: {
    ...mapState('user/center', ['userList']),
    defaultValue() {
      if (this.multiple) {
        let val = null;
        val = this.value;
        if (val instanceof Array) {
          val = arrayToString(val);
        }
        return stringToArray(val);
      } else {
        return this.value;
      }
    },
    _disabledValue() {
      return stringToArray(this.disabledValue);
    },
  },
  // watch: {
  //   value: function (newVal, oldVal) {
  //     console.log('watch', newVal, oldVal);
  //     this.echoInputValue(newVal);
  //   },
  // },
  updated() {
    this.echoInputValue(this.value);
  },
  created() {
    this.echoInputValue(this.value);
  },
  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),
    reload() {
      this.echoInputValue(this.value);
    },
    /**
     * 输入框内容回显
     */
    echoInputValue(data) {
      if (data) {
        let val = null;
        // val = this.value;
        val = data;
        if (val instanceof Array) {
          val = arrayToString(val);
        }
        if (val || val.length) {
          const filterVal = this.userList.filter((v) => {
            return stringToArray(val).includes(v.userId);
          });
          const text = arrayToString(_.uniq(filterVal.map((e) => e.userName)));
          this.inputText = text;
        }
      } else {
        this.inputText = '';
        this.$emit('input', '');
      }
    },
    onDone(data) {
      this.$refs['selectUserHyy'].blur();
      if (this.multiple) {
        this.$emit('input', arrayToString(_.uniq(data.map((e) => e.id))));
      } else {
        this.$emit('input', data.id);
      }
      this.$emit('change', data.id);
    },
  },
  render(h) {
    const self = this;
    return h('el-input', {
      props: {
        value: this.inputText,
        clearable: this.clearable,
        ...this.$attrs,
      },
      attrs: {
        placeholder: self.placeholder || '请选择',
      },
      ref: 'selectUserHyy',
      on: {
        focus: () => {
          self.$refs['selectUserHyy'].blur();
          const disabled = self.$refs['selectUserHyy'].elForm.disabled || false;
          if (disabled) {
            return;
          }
          this.$fuckDrawer({
            width: '548px',
            component: () => {
              return this.$createElement('SelectPanel', {
                props: {
                  multiple: this.multiple,
                  groupList: this.userList,
                  defaultValue: this.defaultValue,
                  disabledValue: this._disabledValue,
                },
                on: {
                  done: this.onDone,
                  reload: this.reload,
                },
              });
            },

          });
        },
        clear: () => {
          this.inputText = '';
          self.$emit('input', '');
        },
      },
    });
  },
};

