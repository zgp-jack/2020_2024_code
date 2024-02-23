<!--  -->
<template>
  <JYWPanel :width="248" title="处理流程" disabled>
    <el-timeline style="padding:0">
      <el-timeline-item
        v-for="v in progress"
        :key="v.id"
        :timestamp="v.time"
        placement="top"
      >
        <div class="progress-container">
          <pure-button v-if="v.processState" class="M-T-10" :label="v.processState | projectProcessState " type="ghost" size="mini" />
          <pure-button v-else-if="v.process" class="M-T-10" :label="v.process | needStatus" type="ghost" size="mini" />
          <div class="M-T-10">
            <span class="label-text">
              {{ v.processState | labelText }}
            </span>

            <template v-if="['technical_analysis','demand_analysis'].includes(v.processState)">
              <span class="label-value">{{ v.value | analysisUser | member }}</span>
            </template>
            <template v-else>
              <span class="label-value">{{ v.user | staffId }}</span>

            </template>
          </div>
          <div v-if="['termination'].includes(v.processState)" class="M-T-20">
            <span class="label-text">
              终止原因:
            </span>
            <span class="label-value">{{ v.value | dicValueToKey('demandTerminationReason') }}</span>

          </div>
          <div v-if="v.hasVote" class="M-T-20">
            <pure-button :label="'投票结果'" type="default" size="mini" @click="clickVoteResult(v.id)" />
          </div>
          <div v-if="v.remark" class="M-T-20">
            <span class="label-text">
              {{ ['assess_transfer_order','transfer_order'].includes(v.processState) ? '故障描述:':'说明:' }}
            </span>
            <span class="label-value lineHeight">{{ v.remark }}</span>
          </div>
          <div v-if="v.processState ==='transfer_order'" class="M-T-20">
            <span class="label-text">
              接单人:
            </span>
            <span class="label-value lineHeight">{{ v.sendUser | member }}</span>
          </div>
          <template v-if="v.processState === 'demand_dist'">
            <div class="M-T-20">
              <span class="label-text">
                调研负责人:
              </span>
              <span v-if="v.value" class="label-value">
                {{ JSON.parse(v.value).principal | member }}
              </span>
            </div>
            <div class="M-T-10">
              <span class="label-text">
                调研参与人:
              </span>
              <template v-if="v.value">
                <span class="label-value lineHeight">
                  {{ JSON.parse(v.value).users | member }}
                </span>
              </template>
            </div>
          </template>

          <Upload v-if="v.enclosure" v-model="v.enclosure" :disabled="true" :show-upload-button="false" />
        </div>
      </el-timeline-item>
    </el-timeline>
  </JYWPanel>
</template>

<script>
import { mixins_base, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
import VoteResult from './voteResult.vue';
import Upload from '@/components/upload';
export default {
  name: 'TimeLine',
  components: {
    Upload,
  },
  filters: {
    labelText(val) {
      const label = {
        demand_assess_ml: '评估人',
        technical_analysis: '技术分析人',
        demand_analysis: '需求分析人',

      };
      return label[val] ? label[val] + ':' : '操作人:';
    },
    analysisUser(val) {
      if (val) {
        const userNames = Object.values(JSON.parse(val));
        return userNames;
      }
      return '';
    },
  },
  mixins: [mixins_base],
  data() {
    return {
      data: [],
    };
  },
  computed: {
    progress() {
      const value = this.data;
      if (value?.length) {
        return value.reverse();
      }
      return [];
    },
  },

  mounted() {
    this.requestData();
  },
  methods: {
    formatterUsers(val) {
      let value = [];
      if (val) {
        const str = JSON.parse(val);
        if (typeof str.users === 'string' && str.users) {
          value = str.users.split(',');
        }
      }
      return value;
    },
    async requestData() {
      this.data = await ProjectAPI.base.getProgress(this.itemCode);
    },
    async clickVoteResult(id) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const result = await ProjectAPI.demand.getVoteData(this.itemCode, id);
      loading.close();
      this.$innerDialog({
        width: '548px',
        title: '投票结果',
        position: 'center',
        component: () => <VoteResult result={result} />,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-timeline-item{
  padding-bottom: 64px !important;
}
::v-deep .el-timeline-item__timestamp {
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #7d8db3;
}
.M{
  &-T{
    &-10{
      margin-top: 10px;

    }
    &-20{
      margin-top: 20px;
    }
  }
}

.label{
  &-text{
font-size: 18px;
font-weight: 400;
color: #7d8db3;
  }
  &-value{
font-size: 18px;
font-weight: 400;
color: #334266;
word-break: break-all;
  }
}
.lineHeight{
  line-height: 1.2;
}
</style>
