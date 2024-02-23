<!-- 二维码配置-->

<template>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-form ref="form" label-width="100px" size="mini" :rules="rules" :model="formData">
        <el-form-item label="展示内容">
          <el-checkbox v-model="formData.showAcceptDept" label="接收科室" :true-label="1" :false-label="0" @change="formData.acceptDept = ''" />
          <el-checkbox v-model="formData.showCustomPhrase" label="自定短语" :true-label="1" :false-label="0" @change="formData.customPhrase = ''" />
        </el-form-item>
        <el-form-item v-if="formData.showAcceptDept" prop="acceptDept" label="接收科室">
          <el-input v-model="formData.acceptDept" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item v-if="formData.showCustomPhrase" prop="customPhrase" label="自定短语">
          <el-input v-model="formData.customPhrase" maxlength="22" show-word-limit />
        </el-form-item>

        <el-form-item prop="qrSize" label="打印尺寸">
          <dic-select v-model="formData.qrSize" :type="'string'" dic-key="qr_size" :clearable="false" />
        </el-form-item>
        <el-form-item prop="printDirection" label="打印方向">
          <el-radio-group v-model="formData.printDirection">
            <el-radio :label="0">
              纵向
            </el-radio>
            <el-radio :label="1">
              横向
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <pure-button label="应用" :loading="loadingSubmit" @click="onSubmit" />
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12" class="right-col">
      <div class="right-col-label">二维码预览</div>
      <div class="right-col-area">
        <department-qr-code :config="formData" />
      </div>
    </el-col>

  </el-row>
</template>

<script>
import DepartmentQrCode from '@/feat/system/department/component/departmentQrCodeCard.vue';
import OtherSettingApi from '../api';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
export default {
  components: {
    DepartmentQrCode,
    DicSelect,
  },
  data() {
    return {
      loadingSubmit: false,
      rules: {
        customPhrase: [{ required: false, validator: (rule, val, cb) => {
          if (this.formData.showCustomPhrase) {
            if (val) {
              cb();
            } else {
              cb(new Error('自定义短语不能为空'));
            }
          } else {
            cb();
          }
        }, }],
        acceptDept: [{ required: false, validator: (rule, val, cb) => {
          if (this.formData.showAcceptDept) {
            if (val) {
              cb();
            } else {
              cb(new Error('接收科室不能为空'));
            }
          } else {
            cb();
          }
        }, }],
      },
      formData: {
        showAcceptDept: 1,
        showCustomPhrase: 1,
        customPhrase: '',
        acceptDept: '',
        qrSize: null,
        printDirection: 0,

      },
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const res = await OtherSettingApi.getDepartmentQrCodeConfig();
      const { showAcceptDept, showCustomPhrase, customPhrase, acceptDept, qrSize, printDirection, } = res;
      this.formData = {
        showAcceptDept: Number(showAcceptDept),
        showCustomPhrase: Number(showCustomPhrase),
        customPhrase: customPhrase || '',
        acceptDept: acceptDept || '',
        deptName: '公共科室',
        qrSize: qrSize,
        printDirection: printDirection,
      };
    },
    onSubmit() {
      try {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.loadingSubmit = true;
            await OtherSettingApi.setDepartmentQrCodeConfig(this.formData);
            this.init();
            this.$message.success('应用成功');
          }
        });
      } catch (err) {
        //
      } finally {
        this.loadingSubmit = false;

        //
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.right{
  &-col{
    box-shadow: -1px 0 0 #F0F2F5;
    &-label{
// margin-left: 16px ;
font-family: MicrosoftYaHeiUISNaNpxibold;
font-size: 16px;
color: #191919;
    }
    &-area{
      // margin: 16px ;
      padding: 16px;
      background-color: #F3F3F3;
    }
  }
}
</style>
