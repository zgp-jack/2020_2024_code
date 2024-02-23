<!-- 接听信息 -->
<template>
  <Panel
    :header-top="{
      title:'接听信息',
      text:`接听人:${Reception}`
    }"
  >
    <div slot="headerBottom" class="headerBottom">
      <span v-if="FormData.time">通话时间： <small>{{ FormData.time | formatSeconds }}</small></span>
      <span v-if="FormData.createTime">报修时间： <small>{{ FormData.createTime }}</small> </span>
    </div>
    <el-form
      ref="form"
      :model="FormData"
      label-width="110px"
      size="mini"
      label-position="right"
      disabled
    >
      <el-form-item label="报修科室">
        <DepartmentCascader v-model="FormData.deptId" class="w100" />
      </el-form-item>

      <el-form-item label="报修地址">
        <el-input v-model="FormData.place" />

      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="报修人">
            <el-input v-model="FormData.user" />

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报修人电话">
            <el-input v-model="FormData.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="FormData.recording" label="录音">
        <pure-audio :the-url="FormData.recording" />
      </el-form-item>
    </el-form>
  </Panel>
</template>

<script>
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import PureAudio from '@/components/audio/audio';
import Panel from '../panel/index.vue';
import { staffId, } from '@/filters';

export default {
  name: 'BigScreeenAnswerInfo',
  components: {
    Panel,
    DepartmentCascader,
    PureAudio,
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
    return {};
  },
  computed: {
    FormData() {
      return this.data.orderInfo;
    },
    Reception() {
      return staffId(this.FormData.reception) || '-';
    },
  },
  mounted() {},
  created() {
  },
  methods: {},
};
</script>
<style lang='scss' scoped>
@import "~@/feat/bigScreen/style/form.scss";
::v-deep .green-audio-player{
  background: #01070d !important;
  border: 1px solid #062440 !important;

}
::v-deep .controls__current-time ,::v-deep .controls__total-time{
   color: #fff !important;
}
::v-deep .green-audio-player .slider{

  background-color: #263a4d !important;
}
</style>
