<template>
  <el-form
    ref="form"
    label-width="120px"
    size="mini"
    :model="formData"
    :rules="rules"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="姓名">
          {{ itemData.name || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电话">
          {{ itemData.mblNo || '-' }}
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="人员去向" class="w-100" prop="whereaboutsId">
      <el-select
        v-model="formData.whereaboutsId"
        class="w-100"
        placeholder="选择人员去向"
        clearable
        filterable
      >
        <el-option
          v-for="item in whereAboutsTagList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="开始日期">

          <el-date-picker
            v-model="formData.startTime"
            class="w-100"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期"
            :picker-options="startPickerOptions"
            @change="onStartTimeChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="formData.endTime"
            :disabled="!formData.startTime"
            class="w-100"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期"
            :picker-options="endPickerOptions"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item class="t-r">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="$emit('done')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import WhereAboutsApi from '../api';
import moment from 'moment';
export default {
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      whereAboutsTagList: [],
      rules: {
        whereaboutsId: [
          { required: true, message: '请选择人员去向', trigger: 'change', }
        ],
      },
      formData: {
        // / 结束时间
        endTime: null,
        // / 开始时间
        startTime: null,
        // / 用户ID
        userId: '',
        // / 去向ID
        whereaboutsId: '',
      },
    };
  },

  computed: {
    endPickerOptions() {
      const self = this;
      return {
        disabledDate(time) {
          return moment(time.getTime()).add(1, 'days') < new Date(self.formData.startTime);
        },
      };
    },
    startPickerOptions() {
      return {
        disabledDate(time) {
          return moment(time.getTime()).subtract(-1, 'days') < new Date();
        },
      };
    },
  },
  mounted() {
    this.getWhereAboutsTagList();
  },
  methods: {
    // 如果截止
    onStartTimeChange(time) {
      if (time > this.formData.endTime) {
        this.formData.endTime = null;
      }
    },
    async getWhereAboutsTagList() {
      this.whereAboutsTagList = await WhereAboutsApi.whereAboutsOptions();
    },
    async onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请填写完整信息');
          return;
        }
        this.formData.userId = this.itemData.userId;
        await WhereAboutsApi.addUserWhereAbouts(this.formData);
        this.$emit('done');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.w-100{
  width: 100%;
}
.t-r{
  text-align: right;
}
</style>
