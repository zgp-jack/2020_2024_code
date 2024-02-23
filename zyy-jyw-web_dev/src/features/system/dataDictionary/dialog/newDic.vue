/**
* @file newDic.vue.vue
* @author huang
* @date 2023/8/22
* @description  添加字典类型弹窗
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <pure-dialog-template>
    <template #title>
      {{ title }}
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item
        label="字典名称"
        prop="dictName"
      >
        <el-input
          v-model="form.dictName"
          placeholder="请输入字典名称"
        />
      </el-form-item>
      <el-form-item
        label="字典类型"
        prop="dictType"
      >
        <el-input
          v-model="form.dictType"
          placeholder="请输入字典类型"
        />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="字典所属"
            prop="dictBelong"
          >
            <el-radio-group v-model="form.dictBelong">
              <el-radio :label="0">
                系统
              </el-radio>
              <el-radio :label="1">
                用户
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="状态"
            prop="status"
          >
            <el-radio-group v-model="form.status">
              <el-radio label="0">
                启用
              </el-radio>
              <el-radio label="1">
                停用
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="字典层级"
        prop="dictLevel"
      >
        <el-radio-group v-model="form.dictLevel">
          <el-radio :label="0">
            单层
          </el-radio>
          <el-radio :label="1">
            多层
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          placeholder="请输入内容"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <pure-button
        label="取消"
        @click="onCancel"
      />
      <pure-button
        label="保存"
        type="primary"
        @click="onSubmit"
      />
    </template>
  </pure-dialog-template>
</template>

<script>
import SystemDataDictionaryApi from '../api';
import { isEmpty, } from 'lodash-es';

export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '新增',
    },
  },
  data() {
    return {
      rules: {
        dictName: [
          { required: true, message: '请输入字典名称', trigger: 'blur', },
        ],
        dictLevel: [
          { required: true, message: '请选择字典层级', trigger: 'blur', },
        ],
        dictType: [
          { required: true, message: '请输入字典类型', trigger: 'blur', },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur', },
        ],
      },
      form: {
        dictLevel: 0,
        dictName: '',
        dictType: '',
        status: '0',
        remark: '',
        dictBelong: 0,
      },
    };
  },
  watch: {
    data: {
      handler(val) {
        if (isEmpty(val)) return;
        this.form = {
          ...val,
        };
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onCancel() {
      this.$emit('done');
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            if (this.form.dictId) {
              await SystemDataDictionaryApi.updateDictionary(this.form);
            } else {
              await SystemDataDictionaryApi.addDictionary(this.form);
              this.$message.success('添加成功');
            }
            this.$emit('done');
          } catch (err) {
            this.$message.error(err);
          }
        }
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
