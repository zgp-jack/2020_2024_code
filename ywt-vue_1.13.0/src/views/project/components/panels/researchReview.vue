<!-- 调研评审 -->
<template>
  <JYWPanel title="调研评审" :disabled="disabled">
    <div class="review__wraper">
      <el-form
        ref="form"
        :model="formData"
        label-width="120px"
        size="mini"
        label-position="right"
        :disabled="disabled"
      >
        <el-form-item label="评审结果">
          <el-radio-group v-model="formData.result">
            <el-radio label="pass">通过</el-radio>
            <el-radio label="reject">不通过</el-radio>
            <el-radio label="next">继续调研</el-radio>
            <el-radio label="order">转工单</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <Pass v-if="formData.result === 'pass'" ref="base" :is-vote="isTimeEnd" />
      <TextArea
        v-if="formData.result === 'reject' || formData.result === 'next'"
        ref="base"
        :type="formData.result"
        :title="formData.result === 'reject' ? '不通过理由' : '继续调研理由'"
        :is-vote="isTimeEnd"
      />
      <Order
        v-if="formData.result === 'order'"
        ref="base"
        :is-vote="isTimeEnd"
      />
    </div>
    <div class="vote__wraper">
      <el-row style="display: flex; align-items: center; margin: 32px 0 0 0">
        <el-col :span="12">
          <p class="desc">投票结果</p>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <pure-button label="发起投票" type="ghost" @click="clickVote" />
          <pure-button label="刷新" type="wire-frame" @click="clickRefresh" />
        </el-col>
      </el-row>
      <template v-if="data.length">
        <div v-for="(v, i) in data" :key="v.id" class="vote__wraper--list">
          <p class="title">
            {{ v.title }}第{{ ++i | numberToChinese }}轮投票
            <el-tag
              :type="v.state | voteStatus(v.waitNum ,v.endTime) | voteStatusType"
              size="mini"
            >
              {{ v.state | voteStatus(v.waitNum ,v.endTime) | voteStatusText }}
            </el-tag>
          </p>
          <p class="s-e-time">
            {{ v.startTime }} - {{ v.endTime || "无限制" }}
          </p>
          <template v-if="v.state">
            <template v-if="v.waitNum">
              <el-row v-if=" showNode(v.endTime)" class="time-end">
                <el-col :span="10" class="count-down">
                  倒计时 <b>{{ countDown(v.endTime) }}</b>
                </el-col>
                <el-col :span="7">
                  <pure-button
                    :disabled="disabled || isTimeEnd"
                    label="补充投票"
                    type="wire-frame"
                    size="mini"
                    @click="addToVote(v, i)"
                  />
                </el-col>
                <el-col :span="7">
                  <pure-button
                    size="mini"
                    type="danger"
                    :disabled="disabled || isTimeEnd"
                    plain
                    label="撤销投票"
                    :loading="backButtonLoading"
                    @click="backToVote(v.id)"
                  />
                </el-col>
              </el-row>
            </template>
          </template>

          <p v-if="showNode(v.endTime)" class="no-vote">
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
  </JYWPanel>
</template>

<script>
import { mapState, } from 'vuex';
import moment from 'moment';
import { mixins_base, } from '@/minxins/project';
import { numberToChinese, } from '@/filters';
import ProjectAPI from '@/apis/project';
import _ from 'lodash';

export default {
  name: 'ResearchReview',
  components: {
    Pass: () => import('./childComponents/researchInfo/pass.vue'),
    TextArea: () => import('./childComponents/researchInfo/content.vue'),
    Order: () => import('./childComponents/researchInfo/order.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Vote: () => import('./childComponents/researchInfo/vote.vue'),
  },
  filters: {
    noVotePerson(val) {
      if (Object.values(val).length) {
        return val.map((e) => e.name).join('、');
      }
      return '-';
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
      if (val && !endTime) {
        params = {
          text: '进行中',
          type: 'success',
        };
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
  mixins: [mixins_base],
  data() {
    return {
      formData: {
        result: 'pass',
      },
      icons: {
        success: require('@/assets/project/icons/zantong.svg'),
        error: require('@/assets/project/icons/buzancheng.svg'),
        remove: require('@/assets/project/icons/qiquan.svg'),

      },
      data: [],
      now: Date.now(),
      endTime: '',
      isTimeEnd: null,
      nextText: '一',
      flag: '',
      addVoteInfo: {},
      backButtonLoading: false,
    };
  },
  watch: {
    isTimeEnd(n, o) {
      if (n) {
        this.getReviewInfo();
      }
    },
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapState('project/index', {
      disabled: (v) => {
        return v['pancelDisabledOptions'].researchView;
      },
    }),

    countDown: {
      get() {
        return (endTime) => {
          if (!endTime) {
            this.isTimeEnd = false;
            return '无限制';
          }
          const s = this.now;
          const e = new Date(endTime).getTime();
          const du = moment.duration(e - s, 'ms');
          const d = du._data.days;
          const h = du.get('hours');
          const m = du.get('minutes');
          const ss = du.get('seconds');
          if (h <= 0 && m <= 0 && ss <= 0) {
            this.isTimeEnd = true;
            return '已超时';
          } else {
            this.isTimeEnd = false;
            return (
              this.prefixinteger(d, 0) +
              '天' +
              this.prefixinteger(h, 2) +
              ':' +
              this.prefixinteger(m, 2) +
              ':' +
              this.prefixinteger(ss, 2)
            );
          }
        };
      },
    },
  },
  async mounted() {
    this.getReviewInfo();
  },
  methods: {
    clickRefresh: _.debounce(function () {
      this.getReviewInfo();
    }, 300),
    submit() {
      return new Promise((r, j) => {
        if (this.isTimeEnd === false) {
          j('投票中,无法提交');
        } else {
          this.$refs['base'].submit().then(() => {
            r();
          }).catch((e) => {
            j(e);
          });
        }
      });
    },
    interVal() {
      let timer = null;
      timer = setInterval(() => {
        if (this.isTimeEnd) {
          clearInterval(timer);
        }
        this.now = Date.now();
      }, 1000);
    },
    /**
     *  处理投票人员信息
     */
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
    showNode(val) {
      if (!val || new Date(val).getTime() > Date.now()) {
        return true;
      } else if (new Date(val).getTime() < Date.now()) {
        return false;
      }
    },

    prefixinteger(num, n) {
      return (new Array(n).join(0) + num).slice(-n);
    },

    successCB() {
      this.getReviewInfo();
    },
    /**
     * 发起投票
     */
    clickVote() {
      if (this.data.length) {
        if (this.isTimeEnd === false) {
          return this.$message.warning('当前投票未结束');
        }
      }
      this.flag = 'new';
      this.$dialog({
        title: this.flag === 'add' ? '追加投票' : '发起投票',
        width: '688px',
        position: 'center',
        component: () => (
          <Vote
            added-vote-info={this.addVoteInfo}
            next-text={this.nextText}
            flag={this.flag}
            onDone={this.successCB}
          />
        ),
      });
    },
    /**
     * 补充投票
     */
    addToVote(value, nextText) {
      this.flag = 'add';
      this.addVoteInfo = {
        id: value.id,
        person: [
          ...value.wait,
          ...value.affirmative,
          ...value.dissenting,
          ...value.abstention
        ].map((e) => e.userId),
        title: value.title,
        s_e_time: [value.startTime, value.endTime],
      };
      this.$dialog({
        title: this.flag === 'add' ? '追加投票' : '发起投票',
        width: '688px',
        position: 'center',
        component: () => (
          <Vote
            added-vote-info={this.addVoteInfo}
            next-text={numberToChinese(nextText)}
            flag={this.flag}
            onDone={this.successCB}
          />
        ),
      });
    },
    /**
     * 撤销投票
     */
    async backToVote(id) {
      try {
        this.backButtonLoading = true;
        await ProjectAPI.demand.backVote(id);
        await this.getReviewInfo();
        this.FETCH_PERFORM_EVENT({ name: 'submitVote', });
        this.backButtonLoading = false;
        this.isTimeEnd = true;
      } catch (error) {
        this.backButtonLoading = false;
        this.$message.error(error);
      }
    },
    /**
     * 获取投票信息
     */
    async getReviewInfo() {
      try {
        this.now = Date.now();
        this.data = (await ProjectAPI.demand.getReViewInfo(this.itemCode)).vote || [];
        this.nextText = numberToChinese(this.data.length + 1);
        this.interVal();
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.content-span {
  font-size: 14px;
  color: #879bba;
  > p {
    font-size: 14px;
    font-weight: 400;
    text-align: justify;
    color: #dcdfe6;
    margin: 0;
    padding: 0;
  }
}
.review__wraper {
  // height: 158px;
  border-bottom: 1px solid #ecf0f7;
}
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
  &.vote__icon--remove {
    color: #909399;
  }
}
.vote__wraper {
  overflow-y: auto;
  // height: 100%;
  font-weight: 400;
  p {
    margin: 0;
    padding: 0;
  }
  .desc {
    font-size: 18px;
    font-weight: 400;
    color: #334266;
  }
   >.vote__wraper--list {
    margin-bottom: 20px;
    > .title {
      margin-top: 8px;
      font-size: 24px;
      font-weight: 400;
      color: #2d405e;
      letter-spacing: 1px;
    }
    > .s-e-time {
      font-size: 14px;
      font-weight: 400;
      color: #7d8db3;
      letter-spacing: 1px;
      margin-top: 8px;
    }
    > .time-end {
      margin-top: 23px;
      display: flex;
      align-items: center;
      > .count-down {
        font-size: 14px;
        color: #879bba;
        font-size: 18px;
        font-weight: 400;
        b {
          font-size: 18px;
          font-weight: 400;
          color: #2d405e;
        }
      }
    }
    > .no-vote {
      margin-top: 19px;
      span {
        font-size: 18px;
        font-weight: 400;
        color: #879bba;
      }
      b {
        font-size: 18px;
        font-weight: 400;
        color: #2d405e;
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
          margin-left: 30px;
          color: #879bba;
          font-size: 18px;
          font-weight: 400;
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
</style>
