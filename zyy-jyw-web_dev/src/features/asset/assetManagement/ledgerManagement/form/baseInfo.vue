/**
* @file baseInfo.vue
* @author huang
* @date 2023/10/27
* @description  新增资产-基础信息
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="120px"
  >
    <el-form-item
      label="资产名称"
      prop="name"
    >
      <el-input
        v-model="form.name"
        placeholder="请输入"
      />
    </el-form-item>
    <el-form-item
      label="规格型号"
      prop="model"
    >
      <el-input
        v-model="form.model"
        placeholder="请输入"
      />
    </el-form-item>
    <el-form-item
      label="资产类型"
      prop="assetsType"
    >
      <dic-select
        v-model="form.assetsType"
        dic-key="ast_asset_type"
      />
    </el-form-item>
    <el-form-item
      label="资产来源"
      prop="assetsSource"
    >
      <dic-select
        v-model="form.assetsSource"
        dic-key="ast_asset_source"
      />
    </el-form-item>
    <el-form-item
      label="所属巡检单元"
      prop="pertainUnit"
    >
      <DicCascader
        v-model="form.pertainUnit"
        dic-key="ins_unit_directory"
      />
    </el-form-item>
    <el-form-item
      label="公共设备"
      prop="isPublic"
    >
      <el-radio-group v-model="form.isPublic">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="使用责任人"
      prop="personLiable"
    >
      <user-select v-model="form.personLiable" />

    </el-form-item>
    <el-form-item
      label="所在位置"
      prop="place"
    >
      <el-input
        v-model="form.place"
        placeholder="请输入"
      />
    </el-form-item>
    <el-form-item
      label="备注"
      prop="remark"
    >
      <el-input
        v-model="form.remark"
        placeholder="请输入"
        type="textarea"
      />
    </el-form-item>
    <el-form-item
      label="附件"
      prop="enclosure"
    >
      <pure-upload v-model="form.enclosure" />
    </el-form-item>

  </el-form>
</template>
<script>
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import DicCascader from '@/features/system/dataDictionary/components/dicCascader.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import { pick, } from 'lodash-es';

export default {
  components: {
    UserSelect,
    DicSelect,
    DicCascader,

  },
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入资产名称', trigger: 'blur', },
        ],
        model: [
          { required: false, message: '请输入规格型号', trigger: 'blur', },
        ],
        assetsType: [
          { required: true, message: '请选择资产类型', },
        ],
        assetsSource: [
          { required: true, message: '请选择资产来源', },
        ],
        pertainUnit: [
          { required: false, message: '请选择所属巡检单元', trigger: 'blur', },
        ],
        isPublic: [
          { required: false, message: '请选择公共设备', trigger: 'blur', },
        ],
        personLiable: [
          { required: false, message: '请输入使用责任人', trigger: 'blur', },
        ],
        place: [
          { required: false, message: '请输入所在位置', trigger: 'blur', },
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur', },
        ],

      },
      form: {
        name: '',
        model: '',
        assetsType: '',
        assetsSource: '',
        pertainUnit: '',
        isPublic: 1,
        personLiable: '',
        place: '',
        remark: '',
        enclosure: [],

      },
    };
  },
  watch: {
    data: {
      handler: function (val) {
        console.log(val, 'vbal');
        if (val) {
          const d = pick(val, Object.keys(this.form));
          d.enclosure = d.enclosure || [];
          this.form = {
            ...d,
          };
        }
      },
      deep: true,
    },
  },
  methods: {
    async submit() {
      let valid = false;
      try {
        valid = await this.$refs.form.validate();
      } catch (e) {
        valid = e;
      }
      return {
        valid,
        form: this.form,
      };
    },
  },
};

</script>
<style lang='scss'
  scoped
>

</style>
