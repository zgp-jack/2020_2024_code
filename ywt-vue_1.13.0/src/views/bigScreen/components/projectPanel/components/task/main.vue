<!--
    添加任务弹窗
-->
<template>
  <el-form
    ref="form"
    size="mini"
    :model="formData"
    label-position="right"
    label-width="120px"
    disabled
  >
    <el-form-item label="里程碑名称">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="里程碑描述">
      <el-input v-model="formData.remark" type="textarea" />
    </el-form-item>
    <el-form-item label="负责人" required prop="principal">
      <el-input :value="formData.principal | member" />
    </el-form-item>
    <el-form-item label="排序">
      <el-col :span="18">
        <el-input :value="Temp" />
      </el-col>
      <el-col style="text-align:right" :span="6">
        <el-switch
          v-model="formData.sort"
          inactive-text="前"
          active-text="后"
          :inactive-value="0"
          :active-value="1"
        />
      </el-col>
    </el-form-item>

  </el-form>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'TaskMain',
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    taskList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      formData: { name: '', remark: '', tempId: '', sort: 0, principal: '', },
    };
  },
  computed: {
    Temp() {
      return _.find(this.taskList, { id: this.formData.tempId, })?.name || '';
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.formData = _.pick(this.data, Object.keys(this.formData));
    },

  },
};
</script>

<style  lang="scss" scoped>
@import "~@/views/bigScreen/style/form.scss";

</style>
