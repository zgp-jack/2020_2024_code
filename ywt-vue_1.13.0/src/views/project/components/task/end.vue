<!--  -->
<template>
  <el-form ref="form" label-position="right" label-width="100px" :model="formData" :rules="rules">
    <el-form-item label="终止原因" prop="processValue">
      <DicRadio v-model="formData.processValue" :type="'string'" :dic-key="DicKey" />
    </el-form-item>
    <el-form-item label="终止说明" prop="remark">
      <el-input v-model="formData.remark" type="textarea" rows="5" />
    </el-form-item>
    <el-form-item class="t-r">
      <el-button type="primary" size="mini" @click="submit">
        提交
      </el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import ProjectAPI from '@/apis/project';
import { mapActions, mapState, } from 'vuex';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
export default {
  name: 'End',
  components: {
    DicRadio,
  },
  props: {
    visible: Boolean,
    where: {
      type: String,
      default: 'project',
    },
    cardViewItemCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      formData: {
        processValue: null,
        itemCode: '',
        remark: '',
      },
      rules: {
        processValue: [{
          required: true,
          message: '请选择',
          trigger: 'change',

        }],
        remark: [{
          required: true,
          message: '说明不能为空',
          trigger: 'change',
        }],
      },

    };
  },
  computed: {
    ...mapState('project/index', ['itemCode']),
    DicKey() {
      console.log(this.where, 'DicKey');
      if (this.where !== 'project') {
        return 'demandTerminationReason';
      }
      return 'itemTerminationReason';
    },

  },
  mounted() {
    // alert();
    console.log(this.cardViewItemCode, '2');
  },
  methods: {
    ...mapActions('project/index', ['FETCH_PERFORM_EVENT']),
    close() {
      this.$emit('update:visible', false);
    },
    async  submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.formData.itemCode = this.itemCode || this.cardViewItemCode;
            await ProjectAPI.base.endProject(this.formData);
            this.$emit('done');
          } catch (e) {
            this.$message.error(e);
          }
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.t-r{
  text-align: right;
}
</style>
