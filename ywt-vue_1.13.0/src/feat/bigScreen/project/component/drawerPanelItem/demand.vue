<!-- 需求信息面板 -->
<template>
  <Panel
    :header-top="{
      title:'创建信息',
      text:`创建人:${panelInfo.injectUser}`
    }"
  >
    <el-form
      ref="formData"
      label-width="130px"
      size="mini"
      label-position="right"
      :model="formData"
      disabled
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="需求类型" required>
            <DicSelect v-model="formData.itemType" dic-key="itemType" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目优先级" required>
            <DicSelect v-model="formData.level" placeholder="请选择项目优先级" dic-key="itemPriority" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="提出人" required>
          <el-input v-model="formData.sponsor" />
        </el-form-item>
      </el-row>
      <el-form-item label="联系电话" required>
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="提出科室" required>
        <CascaderDepartment v-model="formData.organizer" />
      </el-form-item>
      <el-form-item label="提出日期" required>
        <el-date-picker
          v-model="formData.startTime"
          type="date"
          placeholder="选择日期"
          class="w-100"
          :editable="false"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="期望完成日期">
        <el-date-picker
          v-model="formData.endTime"
          :disabled="!formData.startTime "
          type="date"
          placeholder="选择日期"
          class="w-100"
          :editable="false"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item label="涉及系统" required>
        <DicSelect v-model="formData.aboutSystem" placeholder="请选择涉及系统" multiple :default-value="false" dic-key="aboutSystem" />
      </el-form-item>
      <el-form-item label="需求标题" required>
        <el-input v-model="formData.title" placeholder="请填写需求标题" />
      </el-form-item>
      <el-form-item label="需求描述">
        <el-input
          v-model="formData.remark"
          placeholder="请填写需求描述"
          type="textarea"
          rows="5"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="附件">
        <File :data="formData.enclosure" />
      </el-form-item>
    </el-form>
  </Panel>
</template>

<script>
import _ from 'lodash';
import { stringToArray, } from '@/utils/common';
import CascaderDepartment from '@/views/project/components/cascader/cascaderDepartment';
import Panel from '../panel/index.vue';
import File from '../file/index.vue';

import DicSelect from '@/views/project/components/select/selectDic';
import { member, } from '@/filters';
export default {
  name: 'DemandInfo',
  components: {
    DicSelect,
    Panel,
    File,
    CascaderDepartment,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      panelInfo: {
        injectUser: '',
        injectTime: '',
      },
      formData: {
        id: null,
        itemType: '',
        organizer: '',
        sponsor: '',
        phone: '',
        aboutSystem: [],
        level: '',
        startTime: '',
        title: '',
        endTime: '',
        remark: '',
        enclosure: JSON.stringify([]),
      },
    };
  },
  computed: {
    DemandData() {
      return this.data.demand;
    },

  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const rs = this.DemandData;
      this.panelInfo.injectUser = member(rs?.createUser || rs?.updateUser || '');
      this.panelInfo.injectTime = rs.createTime || rs.updateTime || '';
      this.formData = _.pick(rs, Object.keys(this.formData));
      this.formData.aboutSystem = stringToArray(this.formData.aboutSystem);
    },
  },
};
</script>
<style lang='scss' scoped>
@import "~@/feat/bigScreen/style/form.scss";
.w-100 {
  width: 100%;
}

</style>
