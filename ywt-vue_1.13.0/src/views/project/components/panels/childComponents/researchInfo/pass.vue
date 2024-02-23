<!--  -->
<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
    size="mini"
    label-position="right"
    :rules="rules"
    :disabled="pancelDisabledOptions['researchView']"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="项目负责人" prop="principal">
          <UserSelect v-model="formData.principal" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目类型" prop="projectType">
          <DicSelect v-model="formData.projectType" dic-key="projectType" />
        </el-form-item>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="项目优先级" prop="priority">
          <el-select v-model="formData.priority">
            <el-option
              v-for="item in dictionary['itemPriority']"
              :key="item.id"
              :label="item.name"
              :value="Number(item.value)"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="项目级别">
      <el-radio-group v-model="formData.projectLevel">
        <el-radio
          v-for="item in dictionary['itemProjectLevel']"
          :key="item.id"
          :label="item.value"
        >
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState, } from 'vuex';
import { mixins_base, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';

export default {
  name: 'Pass',
  components: {
    DicSelect,
  },
  mixins: [mixins_base],
  props: {
    isVote: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        itemCode: '',
        principal: '',
        priority: '',
        projectLevel: '',
        projectType: 1,
      },
      rules: {
        principal: [{
          required: true,
          trigger: 'change',
          message: '请选择调研负责人',
        }],
        priority: [{
          required: true,
          trigger: 'change',
          message: '请选择项目优先级',
        }, {
          type: 'number',
          trigger: 'change',
        }],
        projectType: [{
          required: true,
          trigger: 'change',
          message: '请选择项目类型',
        }],
      },
    };
  },
  computed: {
    ...mapState('project/index', ['pancelDisabledOptions']),
  },
  mounted() {
    this.formData.projectLevel = this.dictionary['itemProjectLevel'][0].value;
  },
  methods: {

    submit() {
      return new Promise((r, j) => {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const params = {
              itemCode: this.itemCode,
              principal: this.formData.principal,
              priority: this.formData.priority,
              projectLevel: this.formData.projectLevel,
              projectType: this.formData.projectType,
            };

            try {
              await ProjectAPI.demand.submitReview(params, 'pass');
              r(true);
            } catch (e) {
              j(e);
            }
          } else {
            j('表单校验未通过');
          }
        });
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
