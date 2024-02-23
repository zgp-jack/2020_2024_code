<!-- 评审方案 -->
<template>
  <JYWPanel
    :title="confirmOrReview === 'review' ? '任务评审' : '确认结果'"
  >
    <el-form
      ref="form"
      :model="formData"
      label-width="120px"
      size="mini"
      label-position="right"
      :rules="rules"
      :disabled="disabled"
    >
      <el-form-item label="项目名称">
        <span class="font-span">{{ Title }}</span>
      </el-form-item>
      <el-form-item
        :label="confirmOrReview === 'review' ? '评审结果' : '确认结果'"
        prop="result"
      >
        <el-radio-group v-model="formData.result">
          <el-radio label="pass">通过</el-radio>
          <el-radio label="reject">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="formData.result === 'reject'"
        label="不通过原因"
        prop="remark"
      >
        <el-input v-model="formData.remark" type="textarea" rows="5" />
      </el-form-item>
    </el-form>
  </JYWPanel>
</template>

<script>
import { mapMutations, mapState, } from 'vuex';
import ProjectAPI from '@/apis/project';
import _ from 'lodash';
export default {
  name: 'ResearchViewPlan',
  components: {},
  data() {
    return {
      rules: {
        result: [
          {
            required: true,
            trigger: 'change',
            validator: (r, v, cb) => {
              if (!v) {
                return cb(new Error('请选择评审结果'));
              }
              cb();
            },
          }
        ],
        remark: [
          {
            required: true,
            trigger: 'change',
            validator: (r, v, cb) => {
              if (!v) {
                return cb(new Error('请填写不通过原因'));
              }
              cb();
            },
          }
        ],
      },
      formData: {
        result: '',
        remark: '',
        workIds: '',
      },
    };
  },
  computed: {
    ...mapState('project/index', {
      confirmOrReview: 'confirmOrReview',
      ItemCode: 'itemCode',
      disabled: (v) => {
        return v['pancelDisabledOptions'].researchViewPlan;
      },
      WorkIds: (item) => {
        const taskData = item.panelGroupData.work;
        const filterIds = _.filter(taskData, (val) => {
          return val.state !== 2 && val.quoteId === 0;
        });
        const Ids = _.map(filterIds, 'id');
        return _.toString(Ids);
      },
      Title: (item) => {
        return item.researchInfo.title;
      },
    }),

  },
  mounted() {
    this.SET_INJECT_EVENT({ name: 'confirm', fun: this.submit, });
  },
  methods: {
    ...mapMutations('project/index', ['SET_INJECT_EVENT']),
    submit() {
      return new Promise((resolve, reject) => {
        let rs = null;
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            try {
              if (this.confirmOrReview === 'review') {
                const data = {
                  result: this.formData.result,
                  workIds: this.WorkIds,
                  itemCode: this.ItemCode,
                };
                if (this.formData.result === 'reject') {
                  Object.assign(data, { remark: this.formData.remark, });
                }
                rs = await ProjectAPI.setUp.reviewPass(data);
              }

              if (this.confirmOrReview === 'confirm') {
                const data = {
                  itemCode: this.ItemCode,
                };
                if (this.formData.result === 'reject') {
                  Object.assign(data, { remark: this.formData.remark, });
                }
                rs = await ProjectAPI.setUp.confirmResult(
                  data,
                  this.formData.result
                );
              }
              resolve(rs);
            } catch (e) {
              reject(e);
            }
          } else {
            reject('表单校验未通过');
          }
        });
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.font {
  &-span {
    font-size: 18px;
    color: "#334266";
  }
}
</style>
