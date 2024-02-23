<template>
  <el-form ref="form" :inline="true" :rules="rules" :model="formData">
    <el-form-item label="新建工单后每间隔" prop="warningTime">
      <el-input v-model="formData.warningTime" placeholder="最小值" oninput="value=value.replace(/[^\d]/g,'')" @change="onChange" />
    </el-form-item>
    <el-form-item>
      <el-select v-model="formData.unit">
        <el-option label="分钟" :value="1" />
        <el-option label="小时" :value="0" />
      </el-select>
      <span class="text">
        提醒派单
      </span>
    </el-form-item>
  </el-form>
</template>

<script>
import OtherSettingApi from '../api';
import _ from 'lodash';
export default {
  data() {
    return {
      rules: {
        warningTime: [{
          required: false,
          validator: (rule, val, cb) => {
            if (!val) {
              cb(new Error('间隔时间不能为空'));
            } else if (Number(val) === 0) {
              cb(new Error('间隔时间最小为1'));
            } else {
              cb();
            }
          },
        }],
      },
      formData: {
        warningTime: '',
        unit: 1,
      },
    };
  },

  mounted() {
    this.initData();
  },
  methods: {
    onChange: _.debounce(function () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            await OtherSettingApi.setDecentTimeConfig(this.formData);
            this.$message.success('更新成功!');
          } catch (err) {
            this.$message.error(err);
          }
        }
      });
    }, 500),
    async initData() {
      // 时间单位1是分钟，0是小时
      const res = await OtherSettingApi.getDecentTimeConfig();
      this.formData = res;
    },
  },

};
</script>

<style lang="scss" scoped>
.text{
 font-weight: 400;
font-size: 18px;
color: #7D8DB3;
letter-spacing: 0;
}

</style>
