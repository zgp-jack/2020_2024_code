<!--  -->
<template>
  <el-container>
    <el-main>
      <div class="vote__wraper">
        <template v-if="result.length">
          <div v-for="v in result" :key="v.id" class="vote__wraper--list">
            <p class="title">{{ v.title }}第{{ v.linkedIndex | numberToChinese }}轮投票
              <el-tag :type="v.state | voteStatus(v.waitNum,v.endTime) | voteStatusType" size="mini">
                {{ v.state | voteStatus(v.waitNum,v.endTime) | voteStatusText }}
              </el-tag>
            </p>
            <p class="s-e-time">{{ v.startTime }} - {{ v.endTime }}</p>
            <p class="no-vote">
              <span> 未投票 </span>
              <b>{{ v.wait | noVotePerson }}</b>
            </p>
            <el-row class="vote-info">
              <el-col v-for="(item, x) in voteResult(v)" :key="x" :span="8">
                <div class="vote-info-top">
                  <img :src="icons[item.field]" width="18px" height="18px" alt="">

                  <span :class="`vote-person-num ${item.field}`">{{
                    item.num
                  }}</span>
                  <span class="vote-ratio">
                    占比 <span> {{ item.ratio | ratio }}</span>
                  </span>
                </div>
                <p class="vote-person vote-boder">{{ item.person }}</p>
              </el-col>
            </el-row>
          </div>
        </template>
        <template v-else>
          <el-result icon="info" title="暂无投票数据" sub-title="" />
        </template>
      </div>
    </el-main>
    <el-footer class="vote__footer" height="40">
      <pure-button label="关闭" @click="close" />
    </el-footer>
  </el-container>

</template>

<script>
export default {
  filters: {
    noVotePerson(val) {
      if (Object.values(val).length) {
        return val.map((e) => e.name).join('、');
      }
      return '';
    },
    ratio(val) {
      if (val) {
        return (val * 100).toFixed(2) + '%';
      }
      return val + '%';
    },
    voteStatus(val, waitNum, endTime) {
      if (!waitNum) {
        return {
          text: '已结束',
          type: 'default',
        };
      }
      let params = {};
      if (val === 0) {
        params = {
          text: '已撤销',
          type: 'danger',
        };
      }
      if (val && endTime) {
        if (val && new Date(endTime).getTime() > Date.now()) {
          params = {
            text: '进行中',
            type: 'success',
          };
        } else if (val && new Date(endTime).getTime() < Date.now()) {
          params = {
            text: '已结束',
            type: 'default',
          };
        }
      }
      return params;
    },
    voteStatusText(obj) {
      return obj.text;
    },
    voteStatusType(obj) {
      return obj.type;
    },
  },
  components: {
  },
  props: {
    result: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      icons: {
        success: require('@/assets/project/icons/zantong.svg'),
        error: require('@/assets/project/icons/buzancheng.svg'),
        remove: require('@/assets/project/icons/qiquan.svg'),

      },
    };
  },

  methods: {
    close() {
      this.$emit('done');
    },
    voteResult(voteData) {
      const all = [
        ...voteData.wait,
        ...voteData.affirmative,
        ...voteData.dissenting,
        ...voteData.abstention
      ].map((e) => e.userId);
      return [
        {
          field: 'success',
          ratio: voteData.affirmative.length / all.length,
          person: voteData.affirmative.map((e) => e.name).join('、'),
          num: voteData.affirmative.length,
        },
        {
          field: 'error',
          ratio: voteData.dissenting.length / all.length,
          person: voteData.dissenting.map((e) => e.name).join('、'),
          num: voteData.dissenting.length,
        },
        {
          field: 'remove',
          ratio: voteData.abstention.length / all.length,
          person: voteData.abstention.map((e) => e.name).join('、'),
          num: voteData.abstention.length,
        }
      ];
    },
  },
};
</script>
<style lang='scss' scoped>
.success {
  color: #67c23a;
}
.error {
  color: #f56c6c;
}
.default {
  color: #909399;
}
.vote__icon {
  font-size: 16px;
  &.vote__icon--success {
    color: #67c23a;
  }
  &.vote__icon--error {
    color: #f56c6c;
  }
  &.vote__icon--default {
    color: #909399;
  }
}
.vote__wraper {
  overflow-y: auto;
  height: 400px;
  font-weight: 400;
  p {
    margin: 0;
    padding: 0;
  }
  > .vote__wraper--list {
    > .title {
      font-size: 18px;
      font-weight: 500;
      color: #2d405e;
      padding: 16px 0 0 0;
    }
    > .s-e-time {
      font-size: 14px;
      color: #909399;
      margin-top: 8px;
    }
    > .time-end {
      margin-top: 23px;
      display: flex;
      align-items: center;
      > .count-down {
        font-size: 14px;
        color: #879bba;
        b {
          font-size: 14px;
          color: #2d405e;
        }
      }
    }
    > .no-vote {
      margin-top: 19px;
      span {
        font-size: 14px;
        color: #879bba;
        b {
          font-size: 14px;
          color: #2d405e;
        }
      }
    }
    > .vote-info {
      margin-top: 20px;
      .vote-info-top {
        display: flex;
        align-items: center;
        .vote-person-num {
          font-size: 18px;
          font-weight: 600;
          margin-left: 6px;
        }
        .vote-ratio {
          margin-left: 12px;
          color: #879bba;
          > span {
            color: #2d405e;
          }
        }
      }
      .vote-person {
        margin-top: 6px;
        margin-right: 16px;
        font-size: 14px;
        color: #2d405e;
      }
    }
  }

  .vote-boder {
    border-right: 1px solid #ecf0f7;
  }
}
.vote__footer{
  padding: 0;
  text-align: right;
  margin-top: 16px;
}
</style>
