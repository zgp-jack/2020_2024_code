<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 17:08:18
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-28 19:16:47
 * @Description:厂家品牌弹窗
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">厂家信息</div>
        <el-form
          ref="form"
          label-width="110px"
          label-position="right"
          :model="formData"
          :rules="rules"
          size="mini"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="简称">
                <el-input v-model="formData.abbreviation" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型" prop="manufacturerType">
                <dic-select v-model="formData.manufacturerType" dic-key="manufacturerType" />
              </el-form-item>

            </el-col>
          </el-form-item>

          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="主要联系人">
                <el-input v-model="formData.contact" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model="formData.phone" />
              </el-form-item>
            </el-col>

          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formData.remark" type="textarea" rows="4" :maxlength="50" />
          </el-form-item>

          <template v-for="(k, index) in formData.otherContacts">
            <el-form-item :key="index" label-width="0px" class="form-item-wrapper">
              <el-col :span="10">
                <el-form-item
                  :ref="index+'contact'"
                  label="联系人"
                  :prop="'otherContacts.'+index+'.contact'"
                >
                  <el-input v-model="k.contact" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  label="联系电话"
                  :prop="'otherContacts.'+index+'.phone'"
                >
                  <el-input v-model="k.phone" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="index!==0"
                  style="margin-left:16px"
                  @click="onDeleteContact(index)"
                >删除</el-button>
              </el-col>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button
              @click="onAddContact()"
            >添加联系人</el-button>
          </el-form-item>
        </el-form>
      </pure-card>
    </div>
    <div class="footer">
      <el-button
        type="primary"
        size="mini"
        @click="onSubmit"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import BrandApi from '../api';

import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import {
  isArray,
} from 'lodash';

export default {
  name: 'BrandInfoDrawer',
  components: {
    DicSelect,
  },
  mixins: [FormDialog],
  data() {
    return {
      name: '厂家',
      formData: {
        otherContacts: [{
          contact: '',
          phone: '',
        }],
      },
      detailApi: BrandApi.detail,
      rules: {
        name: [{
          required: true, message: '请输入厂家名称', trigger: 'blur',
        }],
        manufacturerType: [{
          required: true, message: '请选择类型', trigger: 'change',
        }],
      },
    };
  },
  methods: {
    async afterFetchDetail() {
      if (this.formData.otherContacts) {
        try {
          this.formData.otherContacts = JSON.parse(this.formData.otherContacts);
          this.formData.otherContacts = isArray(this.formData.otherContacts) ? this.formData.otherContacts : [{ user: '', phone: '', }];
        } catch (error) {
          this.formData.otherContacts = [{ contact: '', phone: '', }];
        }
      } else {
        // 处理一些历史遗留数据
        this.formData.otherContacts = [{ contact: '', phone: '', }];
      }
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        // 过滤掉其他联系人中的空数据
        this.formData.otherContacts = this.formData.otherContacts.filter(item => item.contact || item.phone);
        if (this.operatorType === OPERATOR_TYPES.CREATE) {
          await BrandApi.create(this.formData);
        } else if (this.operatorType === OPERATOR_TYPES.UPDATE) {
          await BrandApi.update(this.formData);
        }
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async onAddContact() {
      this.formData.otherContacts.push({
        user: '',
        phone: '',
      });
    },
    async onDeleteContact(index) {
      this.formData.otherContacts.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
    height: 100%;
    .card {
        height: 100%;
    }
     &::v-deep .pure-card__body {
      max-height:calc(100% - 34px);
      height: calc(100% - 34px);
  }
}
 .footer {
    height: 56px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .form-item-wrapper {
    padding: 0;
    margin-bottom: 0;
}
</style>
