<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-04 22:28:11
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-08 16:04:31
 * @Description:
-->
<template>
  <div>
    <el-form
      ref="form"
      size="mini"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="120px"
    >
      <el-form-item />
      <el-form-item label="排班日期" prop="date">
        <el-date-picker
          v-model="formData.date"
          style="width:100%"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
    </el-form>
    <el-row>
      <el-col
        :span="12"
        style="text-align: left; padding-left: 16px"
      ><el-button
        size="mini"
        @click="$emit('cancel')"
      >取消</el-button></el-col>
      <el-col :span="12" style="text-align:right">
        <el-button
          size="mini"
          type="primary"
          @click="submit"
        >确认生成</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import {
  createDutySchedule,
} from '@/apis/synthesize/workforceManagement';
import {
  bus,
} from '@/utils/bus';
export default {
  props: {
    data: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        date: [],
      },
      rules: {
        date: [
          {
            type: 'array', required: true, message: '请选择日期', trigger: 'change',
          }
        ],
      },
    };
  },
  methods: {
    async submit() {
      try {
        await this.$refs['form'].validate();
        const result = await this.createDutySchedule();
        if (result) {
          const confirm = await this.$confirm(
            `<div style="text-align:center;white-space:pre-line">${result.split(',').join('\n')}
            </div>
            <div style="text-align:center">
              与本次排班数据重叠，是否覆盖原有数据?
            </div>`,
            '提示',
            {
              dangerouslyUseHTMLString: true,
              showClose: false,
              confirmButtonText: '是',
              cancelButtonText: '否',
              closeOnClickModal: false,
              type: '',
            }).catch(() => {
            return 'cancel';
          });
          let isCover;
          if (confirm === 'confirm') {
            isCover = 1;
          } else if (confirm === 'cancel') {
            isCover = 0;
          }
          await this.createDutySchedule(isCover);
        }
        this.$emit('done');
        bus.$emit('reloadData');
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
          duration: 3000,
        });
      }
    },
    async createDutySchedule(isCover = null) {
      try {
        return await createDutySchedule({
          startTime: this.formData.date[0],
          endTime: this.formData.date[1],
          rules: this.data,
          isCover,
        });
      } catch (error) {
        if (error.includes('至')) {
          return error;
        } else {
          return Promise.reject(error);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
