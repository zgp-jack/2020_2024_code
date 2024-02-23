/**
* @file maintenance.vue
* @author huang
* @date 2023/10/27
* @description 维保维护
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="120px"
  >
    <el-form-item label="资产维护">
      <el-select v-model="form.maintainInsideType" @change="changeAsset">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="maintainInfo.formItemLabel"
    >
      <component
        :is="maintainInfo.componentName"
        :value="form.maintainObjId"
        @change="(v)=> form.maintainObjId = v"
      />
    </el-form-item>
    <el-form-item v-if="!showCompany && form.maintainInsideType!==''">
      <pure-button
        icon="add"
        label="添加维保公司"
        type="minor"
        @click="clickAddCompany"
      />
    </el-form-item>
    <el-row
      v-if="showCompany"
      class="bg"
    >
      <el-col
        :span="24"
        class="top"
      >
        <span class="text">维保公司</span>
        <i
          class="el-icon-delete icon"
          @click="delCompany"
        />
      </el-col>

      <el-col :span="24">
        <el-form-item
          label="维保公司"
          prop="maintainCompany"
        >
          <company-select v-model="form.maintainCompany" />
        </el-form-item>
        <el-form-item
          label="维保责任人"
          prop="maintainUser"
        >
          <user-select v-model="form.maintainUser" />
        </el-form-item>
        <el-form-item label="维保到期日期">
          <el-date-picker
            v-model="form.maintainTerm"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-col>

    </el-row>
  </el-form>
</template>
<script>
import UserSelect from '@/features/system/user/components/userSelect.vue';
import TeamSelect from '@/features/system/group/components/teamSelect.vue';
import CompanySelect from '@/features/system/thirdParty/components/selectCompany.vue';
import DeptSelect from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
import { isEmpty, keyBy, pick, } from 'lodash-es';

export default {
  components: {
    UserSelect,
    TeamSelect,
    CompanySelect,
    DeptSelect,
  },
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
      rules: {
        maintainCompany: [
          { required: true, message: '请选择维保公司', trigger: 'blur', },
        ],
        maintainUser: [
          { required: true, message: '请选择维保责任人', trigger: 'blur', },
        ],
        maintainTerm: [
          { required: false, message: '请选择维保到期日期', trigger: 'blur', },
        ],
      },
      form: {
        // 资产维护类型(1用户 2小组 3科室)
        maintainInsideType: '',
        // 维保公司
        maintainCompany: '',
        // 维保责任人
        maintainUser: '',
        // 维保期限
        maintainTerm: '',
        // 指定维护对象标识
        maintainObjId: '',
      },
    };
  },
  computed: {
    maintainInfo() {
      const k = keyBy(this.options, 'value');
      console.log(k[this.form.maintainInsideType], 'k[this.form.maintainInsideType]');

      return k[this.form.maintainInsideType];
    },
  },

  watch: {
    data: {
      handler: function (val) {
        if (val && !isEmpty(val)) {
          const d = pick(val, Object.keys(this.form));
          d.maintainInsideType = d.maintainInsideType || '';
          this.showCompany = !!d.maintainCompany;
          this.form = {
            ...d,
          };
          console.log(this.form);
        }
      },
      deep: true,
    },

  },
  methods: {
    changeAsset() {
      this.form.maintainObjId = '';
    },
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
