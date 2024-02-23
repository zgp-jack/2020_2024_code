import { stringToArray, } from '@/utils/common';
import { find, } from 'lodash';
import { mapState, } from 'vuex';

export default {
  name: 'HyyScscaderDepartment',
  props: {
    value: {
      type: [String, Number],
      required: true,
      default: () => {
        return '';
      },
    },
    placeholder: {
      type: String,
      default: '选择科室',
    },
    showAllLevels: {
      type: Boolean,
      default: true,
    },
    clearable: Boolean,
  },
  computed: {
    ...mapState('systemDepartment', {
      cascaderList: (v) => {
        return v.list;
      },
      originList: (v) => {
        return v.originList;
      },
    }),
    modelValue: {
      get() {
        if (this.value) {
          const findVal = find(this.originList, { id: this.value, });
          const toArr = stringToArray(findVal?.deptNo);
          return toArr;
        }
        return [];
      },
      set(data) {
        this.modelValue = data;
      },
    },
  },
  render(h) {
    const self = this;
    return h('el-cascader', {
      props: {
        placeholder: self.placeholder,
        value: self.modelValue,
        filterable: true,
        options: self.cascaderList,
        showAllLevels: self.showAllLevels,
        clearable: self.clearable,
      },
      style: {
        width: '100%',
      },
      on: {
        change: (v) => {
          self.$emit('input', v[v.length - 1]);
        },
      },
    });
  },
};
