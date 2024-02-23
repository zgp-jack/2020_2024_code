<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-20 14:18:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-08 17:53:40
 * @Description:厂家取走面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      厂家取走
    </template>
    <template #labelText>
      操作人：
    </template>
    <template #labelValue>
      {{ currentUser }}
    </template>
    <template #labelTime>
      创建时间：
    </template>
    <template #labelTimeValue>
      {{ currentTime }}
    </template>
    <el-form
      ref="form"
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
      :model="formData"
      :rules="rules"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="取走人" prop="takeAwayUser">
            <el-input v-model="formData.takeAwayUser" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">
            <el-input v-model="formData.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="实际取走时间">
            <el-date-picker
              v-model="formData.takeAwayTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
            />
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="附件">
        <upload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>
  </collapse-item>
</template>

<script>
import CarryInServiceApi from '../api';
import CarryInServiceMixin from '../mixin';
export default {
  name: 'TakeAwayPanel',
  mixins: [CarryInServiceMixin],
  props: {

    disabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      name: 'TakeAwayPanel',
      formData: {
        takeAwayUser: null,
        phone: null,
        takeAwayTime: null,
        remark: null,
        enclosure: null,
      },
      rules: {
        takeAwayUser: [{
          required: true, trigger: 'blur', message: '请输入取走人',
        }],
      },
    };
  },
  watch: {
    data: {
      handler(val) {
        if (val?.id) {
          this.formData = Object.assign({}, val);
          this.currentTime = this.formData.createTime;
          this.currentUser = this.formData.createUserToName;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async check(repairId) {
      await this.$refs['form'].validate();
      return CarryInServiceApi.manufacturerTakeAway({ ...this.formData, repairId: repairId, });
    },
  },
};
</script>

<style lang="scss" scoped>
.createUser,
.createTime {
  color: #879bba;
  font-size: $--pure-little-font-size;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
</style>
