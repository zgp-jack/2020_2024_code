<!-- 工单接单科室-->
<template>
  <el-row>
    <el-col :span="10">
      <el-alert
        title="配置小程序中,扫码报修的工单可由哪些科室接单"
        type="info"
        show-icon
        :closable="false"
      />
    </el-col>
    <el-col :span="24" class="m-t-16">
      <el-form ref="form" :model="formData" size="small" label-width="100px">
        <el-form-item>
          <pure-button
            icon="el-icon-plus"
            label="添加科室"
            type="wire-frame"
            @click="onPushDepartment"
          />
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formData.depts"
          :key="index"
          :label="'科室' + (index + 1)"
          :prop="'depts.' + index + '.deptId'"
          :rules="{
            required: true,
            message: `科室${index + 1}不能为空`,
            trigger: 'blur'
          }"
        >
          <el-col :span="6">
            <CascaderDepartment
              v-model="item.deptId"
              class="w-100"
              :disabled-list="DisabledList"
            />
          </el-col>
          <el-col :span="1">
            <i class="el-icon-delete  icon" @click="onDelIcon(index)" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="故障分类">
              <DicCascader v-model="item.faultTypes" :disabled-values="dicDisabledValues" :props="{value:'id'}" :dic-key="'faultTypeList'" class="w-100" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="text" size="mini" round @click="onDel(index)">清空故障分类</el-button>

          </el-col>
        </el-form-item>
        <el-form-item>
          <pure-button label="应用" @click="onSubmit" />
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import CascaderDepartment from '@/feat/system/department/component/departmentCascader.vue';
import DicCascader from '@/feat/system/dictionary/normal/component/dicCascader.vue';
import _ from 'lodash';
import OtherSettingApi from '../api';
export default {
  components: {
    CascaderDepartment,
    DicCascader,
  },
  data() {
    return {
      formData: {
        depts: [
          {
            deptId: null,
            faultTypes: null,
          }
        ],
      },
    };
  },
  computed: {
    DisabledList() {
      return this.formData.depts.map(e => e.deptId);
    },
    dicDisabledValues() {
      let faults = this.formData.depts.map(e => e.faultTypes);
      faults = faults.filter(item => item?.length);
      faults = _.flatten(faults);
      console.log(faults);
      return faults;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    changeDicCascader(val, index) {
      const vals = [];
      val.forEach((element, index) => {
        vals.push(_.last(element));
      });
      this.formData.depts[index].faultTypes = vals;
    },
    async init() {
      const res = await OtherSettingApi.getWorkOrderDepartment();
      this.formData.depts = res.map(e => {
        return {
          id: e.id,
          deptId: e.deptId,
          faultTypes: e.faultTypes ? e.faultTypes.split(',') : [],
        };
      });
    },
    onSubmit() {
      console.log(this.formData.depts, 'this.formData.depts');
      this.$refs.form.validate(async valid => {
        if (valid) {
          const data = this.formData.depts.map(item => {
            return {
              deptId: item.deptId,
              faultTypes: item.faultTypes ? item.faultTypes.join(',') : null,
            };
          });
          await OtherSettingApi.setWorkOrderDepartment(data);
          this.init();
          this.$message.success('应用成功!');
        }
      });
    },
    // 添加科室
    onPushDepartment() {
      this.formData.depts.push({
        deptId: null,
      });
    },
    onDelIcon(index) {
      if (index > 0) {
        this.formData.depts.splice(index, 1);
      } else {
        this.$notify.warning('不能删除第一个科室');
      }
    },
    onDel(index) {
      this.formData.depts[index].faultTypes = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.w-100 {
  width: 100%;
}
.m-t-16 {
  margin-top: 16px;
}
.icon {
  font-size: 14px;
  color: #4a4a4a;
  margin-left: 18px;
  cursor: pointer;
  &:hover {
    color: #d62414;
  }
}
</style>
