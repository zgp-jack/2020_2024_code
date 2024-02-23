/**
* @file register.vue
* @author huang
* @date 2023/11/8
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      耗材登记
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="耗材名称"
        prop="name"
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="form.model" />
      </el-form-item>
      <el-form-item label="供应商">
        <company-select v-model="form.supplierId" />
      </el-form-item>
      <el-form-item label="分类">
        <dic-select
          v-model="form.type"
          dic-key="ast_consumable_type"
        />
      </el-form-item>
      <el-form-item
        label="使用单位"
        prop="unit"
      >
        <dic-select
          v-model="form.unit"
          dic-key="ast_consumable_unit"
        />

      </el-form-item>
      <el-form-item label="安全库存">
        <el-input-number
          v-model="form.safeReserve"
          :precision="0"
        />
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="form.price" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="附件">
        <pure-upload v-model="form.enclosure" />
      </el-form-item>
    </el-form>
    <template #footer>
      <pure-button
        label="确定"
        @click="submit"
      />
      <pure-button
        label="取消"
        @click="cancel"
      />

    </template>
  </drawer-template>
</template>
<script>
import DrawerTemplate from '@//common/components/drawer/template.vue';

import CompanySelect from '@/features/system/thirdParty/components/selectCompany.vue';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import PureButton from '@/common/components/button/index.vue';
import ConsumableApi from '../api';

export default {
  components: {
    PureButton,
    DicSelect,
    DrawerTemplate,
    CompanySelect,
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
          { required: true, message: '请输入耗材名称', },
        ],
        unit: [
          { required: true, message: '请选择使用单位', },
        ],
      },
      form: {
        // 附件
        enclosure: [],
        // 规格型号
        model: '',
        // 名称
        name: '',
        // 单价
        price: '',
        // 备注
        remark: '',
        // 安全库存
        safeReserve: null,
        // 供应商
        supplierId: null,
        // 分类(数据字典)
        type: null,
        // 使用单位(数据字典)
        unit: null,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async init() {
      if (this.data?.id) {
        const res = await ConsumableApi.detailConsumable(this.data.id);
        this.form = res.consumable;
        this.form.enclosure = res.consumable.enclosure || [];
      }
    },
    async submit() {
      try {
        const valid = await this.$refs.form.validate();
        if (valid) {
          if (this.form?.id) {
            await ConsumableApi.editConsumable(this.form);
          } else {
            await ConsumableApi.registerConsumable(this.form);
          }
        }
        this.$notify.success('登记成功!');
        this.$emit('done');
      } catch (err) {
        this.$notify.error(err);
      }
    },
    cancel() {
      this.$emit('done');
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
