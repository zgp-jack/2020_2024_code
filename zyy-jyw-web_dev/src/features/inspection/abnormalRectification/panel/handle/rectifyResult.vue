/**
* @file rectifyResult.vue
* @author huang
* @date 2023/10/12
* @description  整改结果-处理
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <pure-panel-card>
    <div slot="header">
      整改结果

    </div>
    <template #subHeader>
      <hyy-sub-label-text
        :value="userInfo.nickName"
        label="整改人"
      />
      <hyy-sub-label-text
        :value="time | timeFormat"
        label="整改时间"
      />

    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="base-margin-top"
      label-width="120px"
    >
      <el-form-item
        label="整改结果说明"
        prop="resultElaborate"
      >
        <el-input
          v-model="form.resultElaborate"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="整改过程照片">
        <pure-upload v-model="form.rectifyPhotos" />
      </el-form-item>
    </el-form>
  </pure-panel-card>
</template>
<script>
import { mapState, } from 'vuex';
import InspectionApi from '@/features/inspection/api';

export default {
  props: {},
  computed: {
    ...mapState('APP_LOGIN', [
      'userInfo',
    ]),
  },
  data() {
    return {
      time: Date.now(),
      form: {
        resultElaborate: '',
        rectifyPhotos: [],
      },
      rules: {
        resultElaborate: [
          {
            required: true,
            message: '请填写整改结果说明',
          },
        ],
      },
    };
  },
  methods: {
    submit(val, cb) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.$set(this.form, 'id', val.id);
            await InspectionApi.abnormalRectification(this.form);
            this.$notify.success('处理成功!');
            cb();
          } catch (err) {
            this.$notify({
              type: 'error',
              message: err,
            });
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
