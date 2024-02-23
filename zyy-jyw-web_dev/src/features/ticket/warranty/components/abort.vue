<template>
  <pure-dialog-template>
    <template #title>
      终止
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item
        label="终止原因"
        prop="reason"
      >
        <!-- <el-select
          v-model="form.rejectReason"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in examineList"
            :key="item.id"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select> -->
        <dic-select v-model="form.reason" dic-key="obs_termination_reason" placeholder="终止原因" size="mini" class="dic-item" />
      </el-form-item>
      <el-form-item
        label="终止说明"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          :rows="3"
          placeholder="请输入内容"
          type="textarea"
        />
      </el-form-item>

    </el-form>
    <template #footer>
      <pure-button
        label="确定"
        @click="onSubmit"
      />
      <pure-button
        v-if="!isCancel"
        type="primary"
        label="取消"
        @click="onCancel"
      />
    </template>
  </pure-dialog-template>
</template>

<script>
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import {
  find,
} from 'lodash-es';

export default {
  name: 'Reject',
  components: {
    DicSelect,
  },
  props: {
    orderNum: {
      type: String,
      default: '',
    },
    isCancel: {
      type: Boolean,
      default: false,
    },
    dicType: {
      type: String,
      default: 'obs_no_examine',
    },
    rejectApi: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      rules: {
        reason: [
          { required: true, message: '请选择终止原因', trigger: 'change', },
        ],
        remark: [
          { required: true, message: '请输入终止说明', trigger: 'blur', },
        ],
      },
      form: {
        orderNum: '',
        remark: '',
        reason: '',
      },
      examineList: [],
    };
  },
  mounted() {
    // this.getConfigs();
  },
  methods: {
    /* 获取缓存配置 */
    getConfigs() {
      const cachedDicList = this.$store.state['SYSTEM_DIC'].list || [];
      const examineList = find(cachedDicList, { type: this.dicType, })?.data || [];
      this.examineList = examineList;
    },
    onDone() {
      this.$emit('done');
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.form.orderNum = this.orderNum;
          await this.rejectApi(this.form);
          this.$message.success('终止成功');
          this.onDone();
        }
      });
    },
    onCancel() {
      this.onDone();
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.dic-item{
  width: 100%;
}
</style>
