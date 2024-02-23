<template>
  <el-form ref="form" :model="formData" size="mini" :rules="rules">
    <el-form-item label="故障分类">
      <span>
        {{ data.name }}
      </span>
    </el-form-item>
    <el-form-item label="处理耗时">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="minTime">
            <el-input v-model="formData.minTime" placeholder="最小值" oninput="value=value.replace(/[^\d]/g,'')" />
          </el-form-item>
        </el-col>
        <el-col :span="2" style="text-align:center">
          ~
        </el-col>
        <el-col :span="6">
          <el-form-item prop="maxTime">
            <el-input v-model="formData.maxTime" placeholder="最大值" oninput="value=value.replace(/[^\d]/g,'')" />
          </el-form-item>

        </el-col>
        <el-col :span="4" :offset="1">
          <el-form-item>
            <el-select v-model="formData.unit">
              <el-option label="分钟" value="minute" />
              <el-option label="小时" value="hours" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form-item>
    <el-form-item style="text-align:right">
      <pure-button label="设置" @click="onSubmit" />
    </el-form-item>

  </el-form>
</template>

<script>
import OtherSettingApi from '../../api';
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      rules: {
        minTime: [
          {
            required: true,
            message: '最小值不能为空',
          },
          {
            validator: (rule, val, cb) => {
              if (this.formData.maxTime) {
                if (Number(val) > Number(this.formData.maxTime)) {
                  cb(new Error('最小值不能大于最大值'));
                }
                cb();
              }
              cb();
            },
          }
        ],
      },
      formData: {
        minTime: '',
        maxTime: '',
        unit: 'minute',
      },
    };
  },
  mounted() {
    this.formData.minTime = this.data.minTime;
    this.formData.maxTime = this.data?.maxTime || '';
    this.formData.unit = this.data?.unit || 'minute';
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await OtherSettingApi.setFaultTypeResponseTime({
            id: this.data.id,
            ...this.formData,
          });
          this.$message.success('设置成功!');
          this.$emit('done', {});
        }
      });
    },
  },
};
</script>

<style>

</style>
