<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-03-17 11:36:57
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-03-17 15:16:45
 * @Description: 大屏展示配置
-->
<template>
  <el-form ref="form" label-width="150px" size="mini" :model="formData" :rules="rules">
    <el-form-item label="展示页面" prop="showItems">
      <el-checkbox-group v-model="formData.showItems" :min="1" :max="2">
        <el-checkbox label="ticket">工单</el-checkbox>
        <el-checkbox label="project">项目</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="页面切换时间" prop="interval">
      <el-input v-model.number="formData.interval" class="value" :min="2" :disabled="formData.showItems.length<2" />
      <span class="unit">分钟</span>
    </el-form-item>
    <el-form-item label="数据统计时间" prop="time">
      <el-date-picker
        v-model="formData.time"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        type="daterange"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="changeTime"
      />

    </el-form-item>
    <el-form-item>
      <pure-button label="应用" :loading="loadingSubmit" @click="onSubmit" />
    </el-form-item>
  </el-form>
</template>

<script>
import OtherSettingApi from '../../api';
import moment from 'moment';
export default {
  data() {
    return {
      formData: {
        interval: 3,
        time: [],
        showItems: ['ticket', 'project'],
        startTime: '',
        endTime: '',
      },
      loadingSubmit: false,
      rules: {
        interval: [{
          validator: (rule, value, callback) => {
            if (this.formData.showItems.length < 2) {
              return callback();
            }
            if (!Number.isInteger(value)) {
              callback(new Error('请输入整数'));
            } else {
              if (value < 2) {
                callback(new Error('页面切换时间最少为2分钟'));
              } else {
                callback();
              }
            }
          },
          trigger: 'blur',
        }],
        showItems: [{
          type: 'array', required: true, message: '请至少选择一个展示页面', trigger: 'change',
        }, {
          validator: (rule, value, callback) => {
            this.$refs.form.validateField('interval');
            callback();
          },
          trigger: 'change',
        }],
      },
    };
  },
  mounted() {
    this.fetchConfig();
  },
  methods: {
    changeTime(time) {
      this.formData.startTime = time[0];
      this.formData.endTime = time[1];
    },
    async fetchConfig() {
      try {
        const data = await OtherSettingApi.getBigScreenConfig();
        this.formData = Object.assign({}, data);
        this.formData.time = [data.startTime || moment().startOf('month').format('yyyy-MM-DD'), data.endTime || moment().endOf('month').format('yyyy-MM-DD')];
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    async onSubmit() {
      try {
        this.loadingSubmit = true;
        await this.$refs.form.validate();
        await OtherSettingApi.setBigScreenConfig(this.formData);
        this.$message.success('操作成功');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      } finally {
        this.loadingSubmit = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.value,.unit {
  width: 100px;
  margin-right: 8px;

}
</style>
