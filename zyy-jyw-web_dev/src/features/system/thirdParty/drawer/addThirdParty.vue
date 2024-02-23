/**
* @file addThirdParty.vue
* @author huang
* @date 2023/10/27
* @description  新增第三方
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      {{ title }}第三方
    </template>
    <hyy-anchor-item title="基础信息">
      <form-base-info
        ref="base"
        :data="result"
      />
    </hyy-anchor-item>
    <hyy-anchor-item title="联系人">
      <form-contact-person
        ref="contact"
        :data="result?.contact || []"
      />
    </hyy-anchor-item>
    <template #footer>
      <pure-button
        label="保存"
        @click="onSave('save')"
      />
      <pure-button
        label="保存并继续新增"
        type="major"
        @click="onSave('next')"
      />
      <pure-button
        label="取消"
        type="minor"
        @click="onCancel"
      />

    </template>
  </drawer-template>
</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import FormBaseInfo from '../form/baseInfo.vue';
import FormContactPerson from '../form/contactPerson.vue';
import PureButton from '@/common/components/button/index.vue';
import ThirdPartyApi from '../api';

export default {
  components: {
    PureButton,
    DrawerTemplate,
    FormBaseInfo,
    FormContactPerson,
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
      result: null,
    };
  },
  computed: {
    title() {
      return this.data && this.data?.deptId ? '编辑' : '新增';
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (this.data?.deptId) {
        const rs = await ThirdPartyApi.getThirdDetail(this.data.deptId);
        this.result = rs;
      }
    },
    async onSave(type) {
      const baseForm = await this.$refs.base.submit();
      const contactForm = await this.$refs.contact.submit();
      if (baseForm.valid && contactForm.valid) {
        const form = {
          ...baseForm.form,
          ...contactForm.form,
        };
        let msg = '';
        try {
          if (this.data?.deptId) {
            await ThirdPartyApi.updateThird(form);
            msg = '修改成功';
          } else {
            await ThirdPartyApi.addThird(form);
            msg = '添加成功';
          }
          this.$notify({
            type: 'success',
            message: msg,
          });
          this.$refs.base.$refs.form.resetFields();
          this.$refs.contact.$refs.form.resetFields();
          if (type !== 'next') {
            this.$emit('done');
          }
        } catch (err) {
          this.$notify({
            type: 'error',
            message: err,
          });
        }
      }
    },
    onCancel() {
      this.$emit('done');
    },
  },
};
</script>
<style lang='scss'
  scoped
>

</style>
