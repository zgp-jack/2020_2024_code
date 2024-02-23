<!--  -->
<template>
  <el-container>
    <el-header class="process-panel-wrapper--header" height="51px">
      <span>
        历史流程
      </span>
    </el-header>
    <el-main>
      <el-timeline class="process-timeline">
        <el-timeline-item
          v-for="v in data"
          :key="v.id"
          :timestamp="v.time"
          placement="top"
        >
          <h6 class="name">操作人:{{ v.userName }}</h6>
          <div>
            <Button v-if="v.hasVote" @click="clickVoteResult(v.id)">
              投票结果
            </Button>
          </div>

          <Button v-if="v.processState" class="m-t-10" @click="clickProcessState(v)"> {{ v.processState | projectProcessState('处理任务') }}</Button>
          <Button v-else-if="v.process" class="m-t-10  ">{{ v.process | needStatus }}</Button>

          <span v-else class="tag">-</span>
          <h6 v-if="v.remark" class="text">说明:{{ v.remark }}</h6>
          <template v-if="v.processState ==='demand_dist'">
            <h6 class="name">
              调研负责人:{{ JSON.parse(v.value).principalName }}
            </h6>
            <h6 class="name">
              调研参与人:{{ JSON.parse(v.value).userNames }}
            </h6>
          </template>
        </el-timeline-item>
      </el-timeline>
    </el-main>

    <Dialog :visible="visibleVote" :width="dialogWidth.mini_px" :title="'投票信息'" @close="visibleVote = false">
      <Vote :data="voteData" />
    </Dialog>
  </el-container>

</template>

<script>
import Dialog from '@/views/bigScreen/components/projectPanel/components/dialog/index.vue';
import Vote from '@/views/bigScreen/components/projectPanel/components/vote/index.vue';
import dialogWidth from '@/views/project/common/width/dialog';
import ProjectAPI from '@/apis/project';
import Button from '@/views/bigScreen/components/projectPanel/components/button/index.vue';

export default {
  name: 'TimeLine',
  components: {
    Dialog,
    Vote,
    Button,
    // Upload: () => import('@/components/upload'),
    // eslint-disable-next-line vue/no-unused-components
    // VoteResult: () => import('./voteResult.vue'),
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    itemCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogWidth,
      voteData: [],
      visibleVote: false,
    };
  },

  mounted() {
    this.handleProcessLastState();
  },
  methods: {
    handleProcessLastState() {
      const lastData = this.data[this.data.length - 1];

      this.$emit('loadState', lastData);
    },
    clickProcessState(data) {
      this.$emit('loadState', data);
    },
    async clickVoteResult(id) {
      let loading = null;
      try {
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        this.voteData = await ProjectAPI.demand.getVoteData(this.itemCode, id);
        this.visibleVote = true;
      } catch (error) {
        this.$message.error(error);
      } finally {
        loading.close();
      }
    },
  },
};
</script>
<style lang="scss" scoped>

::v-deep .el-timeline-item__timestamp {
font-size: 18px;
font-family: AlibabaPuHuiTi_2_55_Regular, AlibabaPuHuiTi_2_55_Regular-Regular;
font-weight: 400;
text-align: left;
color: #C9E5FF;
}
::v-deep .el-timeline-item__node--normal{
width: 6px !important;
    height: 6px !important;
    background: #C9E5FF;
}
::v-deep .el-timeline-item__node{
  border-radius: 0 !important;
}
::v-deep .el-timeline-item__tail{
    opacity: 0.3;
    left: 2px;
    z-index: 0;
    border-left: 1px solid #C9E5FF;
}
::v-deep .el-timeline-item__wrapper{
  top: -9px !important;
}

::v-deep .el-main{
  &::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
  }
  &::-webkit-scrollbar-thumb {
    background: #1890ff !important;
    border-radius: 0 !important;
  }
  &::-webkit-scrollbar-track {
    background: transparent !important;
  }
}

.tag{
height: 32px;
line-height: 32px;
padding: 0 6px;
display: inline-block;
background: linear-gradient(90deg,rgba(201,229,255,0.20), rgba(201,229,255,0.00) 50%, rgba(201,229,255,0.20));
border: 1.5px solid rgba(201,229,255,0.30);
font-size: 18px;
font-family: AlibabaPuHuiTi_2_75_SemiBold, AlibabaPuHuiTi_2_75_SemiBold-Regular;
font-weight: 400;
text-align: left;
color: #c9e5ff;
}
.name{
margin: 15px 0 ;
padding: 0;
font-size: 18px;
font-family: AlibabaPuHuiTi_2_55_Regular, AlibabaPuHuiTi_2_55_Regular-Regular;
font-weight: 400;
text-align: left;
color: #c9e5ff;
}
.text{
  @extend .name
}
.flag {
  height: 32px;
  display: inline-block;
  padding: 0 6px;
  background: #f0f4fc;
  border-radius: 4px;
  font-size: 18px;
  line-height: 32px;
  font-weight: 400;
  text-align: center;
  color: #426ed7;
  margin: 0;
}
.m-t-10{
  margin-top: 10px;
}
.span-tag {
  display: inline-block;
}
.process {
  &-panel {
    &-wrapper {
      &--header {
        line-height: 51px;
        border-bottom: 2px solid #C9E5FF ;
        span {
          font-size: 18px;
          font-family: AlibabaPuHuiTi_2_75_SemiBold,
            AlibabaPuHuiTi_2_75_SemiBold-Regular;
          font-weight: 400;
          color: #c9e5ff;
        }
      }
    }
  }
    &-timeline{
        margin-top: 20px;
    }
}
</style>
