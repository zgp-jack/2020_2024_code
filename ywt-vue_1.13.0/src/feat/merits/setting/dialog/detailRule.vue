<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-11 16:40:26
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-07-22 10:32:50
 * @Description:评分细则弹窗
-->
<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
    label-position="right"
    size="mini"
  >
    <el-form-item label-width="0px" class="form-item-wrapper">
      <el-col :span="12">
        <el-form-item label="一级指标" prop="deptName">
          <el-select v-model="formData.name" placeholder="一级指标" @change="onNameChange">
            <el-option
              v-for="item in nameOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="二级指标">
          <el-select v-model="formData.second" placeholder="二级指标" :disabled="!secondOptions.length">
            <el-option
              v-for="item in secondOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item label-width="0px" class="form-item-wrapper">
      <el-col :span="12">
        <el-form-item label="分值类别" prop="deptPlace">
          <dic-select v-model="formData.indexType" dic-key="score_type" type="string" @change="fetchCalRule" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="计算规则" prop="deptPlace">

      <el-select ref="calculationRule" v-model="formData.calculationRule" placeholder="" :disabled="!calRuleOptions.length" class="w-100" @change="onCalRuleChange">
        <el-option
          v-for="item in calRuleOptions"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="指标描述" prop="indexDescription">
      <el-input
        v-model="formData.indexDescription"
        type="textarea"
        row="4"
      />
    </el-form-item>

    <el-form-item label-width="0px" class="form-item-wrapper">
      <el-col :span="12">
        <el-form-item v-show="formData.indexType==='02'" label="单项评分" prop="singleScore">
          <el-input v-model="formData.singleScore" style="width: 80%" @input="onInputScore($event,'singleScore')" /><span class="unit"> 分</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单项总分" prop="score">
          <el-input v-model="formData.score" style="width: 80%" @input="onInputScore($event,'score')" /><span class="unit"> 分</span>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="备注" prop="note">
      <el-input v-model="formData.note" />
    </el-form-item>
    <div class="align-right">
      <pure-button label="提交" @click="onSubmit" />
    </div>
  </el-form>
</template>

<script>
import SettingApi from '../api';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
export default {
  components: {
    DicSelect,
  },
  props: {
    performanceId: {
      type: Number,
      default: null,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    operatorType: {
      type: String,
      default: 'CREATE',
    },
  },
  data() {
    return {
      formData: {
        name: null,
        second: null,
        calculationRule: null,
        indexType: '',
        indexDescription: '',
        score: null,
        singleScore: null,
        note: '',
      },
      // 计算规则数据
      calRuleList: [],
    };
  },
  computed: {
    // 指标字典数据
    scoreRuleData() {
      return this.$store.state['dictionary']['dicList']['score_rule'] || [];
    },
    // 一级指标选项数据
    nameOptions() {
      return this.scoreRuleData.filter((item) => !item.parent_id).map(item => ({
        label: item.name,
        value: item.value,
      }));
    },
    // 二级指标选项数据
    secondOptions() {
      const parentId = this.scoreRuleData.find(item => item.value === this.formData.name)?.id;
      return this.scoreRuleData.filter((item) => (parentId && item.parent_id === parentId)).map(item => ({
        label: item.name,
        value: item.value,
      }));
    },
    // 计算规则选项数据
    calRuleOptions() {
      return this.calRuleList.map(item => ({
        label: item.calculationRule,
        value: item.id,
        desc: item.indexDescription,
      }));
    },
  },
  created() {
    if (this.operatorType === 'UPDATE') {
      this.formData = Object.assign({}, this.formData, this.data);
      this.fetchCalRule();
    }
  },
  methods: {
    // 获取计算规则数据
    async fetchCalRule() {
      try {
        this.calRuleList = await SettingApi.calculationRuleList(this.formData.indexType);
        if (this.operatorType === 'UPDATE') return; // 新增才自动弹出下拉 编辑 'UPDATE' 无需弹出且无需下面初始化数据
        this.formData.calculationRule = this.calRuleList[0].id || '';
        this.formData.indexDescription = this.calRuleList[0].indexDescription || '';
        this.$nextTick(() => {
          this.$refs.calculationRule.toggleMenu();
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    onNameChange() {
      this.formData.second = null;
    },
    onCalRuleChange() {
      const rule = this.calRuleList.find(item => item.id === this.formData.calculationRule);
      this.formData.indexDescription = rule?.indexDescription;
    },
    async onSubmit() {
      try {
        if (this.operatorType === 'CREATE') {
          await SettingApi.createDetailRule({ ...this.formData, performanceId: this.performanceId, });
        } else {
          await SettingApi.updateDetailRule({ ...this.formData, performanceId: this.performanceId, });
        }
        this.$message.success('操作成功');
        this.$emit('done');
      } catch (error) {
        this.$message.error(error);
      }
    },
    onInputScore(value, type) {
      type === 'score' ? this.formData[type] = value.replace(/[^0-9.]/g, '') : this.formData[type] = value.replace(/[^\-?\d]/g, '');
    },

  },
};
</script>

<style lang="scss" scoped>
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
  .el-col-12 {
    padding:0;
  }
}
</style>
