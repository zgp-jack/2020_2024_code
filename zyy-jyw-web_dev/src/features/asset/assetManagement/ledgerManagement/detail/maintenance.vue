/**
* @file maintenance.vue
* @author huang
* @date 2023/10/27
* @description 维保维护
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-descriptions
    :column="2"
    border
  >

    <el-descriptions-item
      v-if="maintainInfo.formItemLabel"
      :label="maintainInfo.formItemLabel"
      :span="2"
    >
      {{ form.maintainObjName }}

    </el-descriptions-item>
    <el-descriptions-item
      :span="2"
      label="维保公司"
    >
      {{ form.maintainCompanyName }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="1"
      label="维保责任人"
    >
      {{ form.maintainUserName }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="1"
      label="维保到期日期"
    >
      {{ form.maintainTerm | timeFormat }}
    </el-descriptions-item>

  </el-descriptions>
</template>
<script>
import { isEmpty, keyBy, pick, } from 'lodash-es';

export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      // 维保公司显示控制
      showCompany: false,
      options: [
        {
          label: '个人维护',
          value: 1,
          formItemLabel: '维护人员',
          componentName: 'user-select',
        },
        {
          label: '小组维护',
          value: 2,
          formItemLabel: '维护小组',
          componentName: 'team-select',
        },
        {
          label: '科室维护',
          value: 3,
          formItemLabel: '维护科室',
          componentName: 'dept-select',
        },
        {
          label: '无需维护',
          value: '',
        },

      ],

      form: {
        // 资产维护类型(1用户 2小组 3科室)
        maintainInsideType: '',
        // 维保公司
        maintainCompanyName: '',
        // 维保责任人
        maintainUserName: '',
        // 维保期限
        maintainTerm: '',
        // 指定维护对象标识
        maintainObjId: '',
        maintainObjName: '',
      },
    };
  },
  computed: {
    maintainInfo() {
      console.log(this.form.maintainInsideType);
      const k = keyBy(this.options, 'value');
      return k[this.form.maintainInsideType];
    },
  },

  watch: {
    data: {
      handler: function (val) {
        if (val && !isEmpty(val)) {
          const d = pick(val, Object.keys(this.form));
          d.maintainInsideType = d.maintainInsideType || '';
          this.form = {
            ...d,
          };
        }
      },
      deep: true,
    },
    maintainInfo: {
      handler(val) {
        this.form.maintainObjId = '';
      },
      deep: true,
    },
  },
  methods: {
    clickAddCompany() {
      this.showCompany = true;
    },
    delCompany() {
      this.showCompany = false;
    },
    async submit() {
      let valid = false;
      try {
        valid = await this.$refs.form.validate();
      } catch (err) {
        valid = err;
      }
      return {
        valid,
        form: this.form,
      };
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.bg {
  background: #F0F7F7;
}

.top {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 16px;

  .text {
    font-size: 16px;
    font-weight: 400;
    color: #282827;
  }

  .icon {
    font-size: 16px;
    color: #4A4A4A;
  }

}

</style>
