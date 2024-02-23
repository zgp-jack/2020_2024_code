/**
* @file addContent.vue
* @author huang
* @date 2023/8/18
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="140px"
      size="small"
    >
      <el-form-item label="字典类型">
        <el-input
          v-model="form.dictType"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        v-if="isMultiLevel"
        label="上级"
      >
        <el-select
          v-model="form.parentId"
          placeholder="请选择上级"
          clearable
        >
          <el-option
            v-for="item in optionDict"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="数据标签"
        prop="dictLabel"
      >
        <el-input
          v-model="form.dictLabel"
          placeholder="请输入数据标签"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="数据键值"
        prop="dictValue"
      >
        <el-input
          v-model="form.dictValue"
          placeholder="请输入数据键值"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="显示排序"
        prop="dictSort"
      >
        <el-input-number
          v-model="form.dictSort"
          :min="0"
          :max="9999"
          controls-position="right"
        />
      </el-form-item>

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
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          placeholder="请输入内容"
          type="textarea"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SystemDataDictionaryApi from '../api';

export default {
  components: {},
  props: {
    currentData: {
      type: Object,
      default() {
        return {
          status: '0',
        };
      },
    },
  },
  data() {
    return {
      // 表单校验
      rules: {
        dictLabel: [
          { required: true, message: '数据标签不能为空', trigger: 'blur', },
          { max: 100, message: '数据标签长度不超过100字符', },
        ],
        dictValue: [
          { required: true, message: '数据键值不能为空', trigger: 'blur', },
          { max: 50, message: '数据键值长度不超过50字符', },
        ],
        dictSort: [
          { required: true, message: '显示顺序不能为空', trigger: 'blur', },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur', },
        ],
      },
      form: {
        // * 状态（0正常 1停用）
        status: '0',
        dictLevel: 0,
      },
      optionDict: [],
    };
  },
  computed: {
    // 是否是多级字典
    isMultiLevel() {
      return Number(this.form.dictLevel) > 0;
    },

  },
  watch: {
    currentData: {
      handler(newVal) {
        if (newVal) {
          this.form = {
            ...newVal,
          };
          this.getList();
          this.$nextTick(() => {
            this.$refs.formRef.clearValidate();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async getList() {
      if (this.isMultiLevel) {
        const rs = await SystemDataDictionaryApi.getDictionaryDataList({
          dictType: this.form.dictType,
          pageSize: 999,
          pageNum: 1,
        });
        this.optionDict = rs.rows;
      }
    },
    reset() {
      this.formData = {};
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    validate() {
      const result = {};
      this.$refs.formRef.validate(valid => {
        result.valid = valid;
        if (valid) {
          const data = { ...this.form, };
          result.data = data;
        }
      });
      return result;
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
