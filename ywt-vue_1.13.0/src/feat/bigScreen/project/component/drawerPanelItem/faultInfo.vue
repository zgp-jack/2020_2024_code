<!-- 故障信息 -->
<template>
  <Panel
    :header-top="{
      title:'故障信息',
      text:`建单人:${User}`
    }"
  >
    <div slot="headerBottom" class="headerBottom">
      <span v-if="FormData.createTime">建单时间: <small>{{ FormData.createTime }}</small> </span>
    </div>
    <el-form
      ref="form"
      :model="FormData"
      label-width="110px"
      size="mini"
      label-position="right"
      disabled
    >
      <el-form-item label="来源">
        <DicSelect v-model="FormData.source" dic-key="faultSource" />
      </el-form-item>

      <el-form-item label="指派人员">
        <el-col :span="11">
          <el-input :value="FormData.sendUser | member" />
        </el-col>
        <el-col :span="12" :offset="1">
          <el-checkbox v-model="isMyself">由我处理</el-checkbox>
        </el-col>
      </el-form-item>

      <el-form-item label="故障分类">
        <FaultTypeSelect
          v-model="FormData.faultType"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="故障描述">
        <el-input v-model="FormData.faultRemark" />
      </el-form-item>
      <el-form-item label="详细说明">
        <el-input v-model="FormData.detailInfo" type="textarea" />
      </el-form-item>
      <el-form-item label-width="0px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计工时" prop="reqTime">
              <el-input
                v-model="FormData.reqTime"
                style="width: 80%"
                placeholder=""
              />
              <span class="unit">小时</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间" label-width="95px" prop="completeTime">
              <el-input :value=" FormData.completeTime | date('YYYY-MM-DD HH:mm:ss')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="项目优先级">
        <DicRadio v-model="FormData.degree" dic-key="itemPriority" type="string" />
      </el-form-item>
      <el-form-item label="影响范围">
        <DicRadio v-model="FormData.rangeType" dic-key="faultScope" type="string" />
      </el-form-item>
      <el-form-item label="响应类型">
        <DicRadio v-model="FormData.responseType" dic-key="responseType" type="string" />
      </el-form-item>
      <el-form-item
        v-if="FormData.responseType === '2'"
        label="预约时间"
        required
      >
        <el-date-picker
          v-model="FormData.appointment"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          align="right"
          :prefix-icon="'null'"
          :clear-icon="'null'"
        />
      </el-form-item>
      <el-form-item label="附件">
        <File :data="FormData.enclosure" />
      </el-form-item>
    </el-form>
  </Panel>
</template>

<script>
import { mapState, } from 'vuex';
import FaultTypeSelect from '@/views/reportFault/sharedComponents/select/faultTypeSelect.vue';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import File from '../file/index.vue';
import Panel from '../panel/index.vue';
import { staffId, } from '@/filters';

export default {
  components: {
    FaultTypeSelect,
    DicRadio,
    DicSelect,
    Panel,
    File,
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

    };
  },
  computed: {
    User() {
      return staffId(this.FormData.createUser) || '-';
    },
    FormData() {
      return this.data.orderFault;
    },
    ...mapState('login', {
      MyId: (v) => {
        return Number(v.userInfo.id) || 0;
      },
    }),
    isMyself() {
      return this.FormData.sendUser === this.MyId;
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
@import "~@/feat/bigScreen/style/form.scss";

</style>
