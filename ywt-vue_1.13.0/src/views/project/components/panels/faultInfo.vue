<!-- 故障信息 -->
<template>
  <JYWPanel
    :key="'faultInfo'"
    p-k="faultInfo"
    title="故障信息"
    left-flag-title="建单人"
    :left-flag-value="formData.createUser | staffId"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    :expand="expand"
    :disabled="true"
  >
    <template #bottom>
      <span>建单时间：<b>{{ formData.createTime }}</b></span>
    </template>
    <el-form
      ref="form"
      :model="formData"
      label-width="110px"
      size="mini"
      label-position="right"
      :disabled="true"
    >
      <el-form-item label="来源">
        <DicSelect v-model="formData.source" dic-key="faultSource" />

      </el-form-item>

      <el-form-item label="指派人员">
        <el-col :span="11">
          <el-input :value="formData.sendUser | member" />
        </el-col>
        <el-col :span="12" :offset="1">
          <el-checkbox v-model="isMyself">由我处理</el-checkbox>
        </el-col>
      </el-form-item>

      <el-form-item label="故障分类">
        <FaultTypeSelect
          v-model="formData.faultType"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="故障描述">
        <el-input v-model="formData.faultRemark" />
      </el-form-item>
      <el-form-item label="详细说明">
        <el-input v-model="formData.detailInfo" type="textarea" />
      </el-form-item>
      <el-form-item label-width="0px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计工时" prop="reqTime">
              <el-input
                v-model="formData.reqTime"
                style="width: 80%"
                placeholder=""
              />
              <span class="unit">小时</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间" label-width="95px" prop="completeTime">
              <el-date-picker
                v-model="formData.completeTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                align="right"
                :prefix-icon="'null'"
                :clear-icon="'null'"
                class="date-picker"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="项目优先级">
        <DicRadio v-model="formData.degree" dic-key="itemPriority" type="string" />
      </el-form-item>
      <el-form-item label="影响范围">
        <DicRadio v-model="formData.rangeType" dic-key="faultScope" type="string" />
      </el-form-item>
      <el-form-item label="响应类型">
        <DicRadio v-model="formData.responseType" dic-key="responseType" type="string" />
      </el-form-item>
      <el-form-item
        v-if="formData.responseType === '2'"
        label="预约时间"
        required
      >
        <el-date-picker
          v-model="formData.appointment"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          align="right"
          :prefix-icon="'null'"
          :clear-icon="'null'"
        />
      </el-form-item>
      <el-form-item label="附件">
        <Upload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>
  </JYWPanel>
</template>

<script>
import { mapGetters, mapState, } from 'vuex';
import FaultTypeSelect from '@/views/reportFault/sharedComponents/select/faultTypeSelect.vue';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';

export default {
  components: {
    Upload: () => import('@/components/upload/index.vue'),
    FaultTypeSelect,
    DicRadio,
    DicSelect,
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapState('login', {
      MyId: (v) => {
        return Number(v.userInfo.id) || 0;
      },
    }),
    ...mapState('project/index', {
      expand: (v) => {
        return v['pancelExpandOptions'].faultInfo;
      },

    }),
    ...mapGetters('project/index', ['getterPanelGroupData']),
    formData() {
      return this.getterPanelGroupData.orderFault || {};
    },
    isMyself() {
      return this.formData.sendUser === this.MyId;
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
</style>
