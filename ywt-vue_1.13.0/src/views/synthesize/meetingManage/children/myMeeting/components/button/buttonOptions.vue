
<script>
import moment from 'moment';
import { mapGetters, } from 'vuex';
import _ from 'lodash';
export default {
  name: 'OptionsMenu',
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    where: {
      // meeting | project
      type: String,
      default: 'meeting',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    Data() {
      return this.data;
    },
    OperaType() {
      return String(this.Data.operaType);
    },
    UserId() {
      return this.userInfo.id;
    },
    FlagState() {
      return String(this.data.flag);
    },
    // 是否有审核人
    IsReviewerUser() {
      return !!this.Data?.audits.length;
    },
    // 是否审核通过
    IsReviewer() {
      return this.Data.auditState === 1;
    },
    // 是否需要审核
    NeedReview() {
      // 我主持
      if (['1', '2'].includes(this.OperaType)) {
        // 有审核人 。判断是否审核通过
        if (this.IsReviewerUser) {
          return this.IsReviewer ? 'pass' : 'reject';
        }
        return 'not';
      }
      return 'not';
    },
    // 我是否是主持人
    IsHost() {
      if (this.Data.hosts?.length) {
        const userId = this.Data.hosts[0].user;
        return this.UserId === userId;
      }
      return false;
    },
    // 我是否参与
    IsJoin() {
      if (this.Data.attends?.length) {
        //  type  (1我主持的 2我参会的 3我审核的 4我创建的)
        const filterJoin = this.Data.attends.filter(e => e.type === 3);
        const users = filterJoin.map(e => e.user);
        return users.includes(this.UserId);
      }
      return false;
    },
    // 我是否审核
    IsAudit() {
      if (this.Data.audits?.length) {
        const userId = this.Data.audits[0].user;
        return this.UserId === userId;
      }
      return false;
    },
    // 我是否创建
    IsCreate() {
      return [this.Data.createUser].includes(this.UserId);
    },
    isTimeOut() {
      const currentDate = moment();
      const dataDate = moment(this.Data.time);
      const isAfter = dataDate.isAfter(currentDate);
      const isSame = currentDate.isSame(dataDate, 'day');
      if (isAfter || isSame) {
        return 'no_timeOut';
      }
      return 'timeOut';
    },

    Options() {
    // operaType : 过滤数据类别
    // 我主持的: '1',
    // 我参与的: '2',
    // 我审核的: '3',
    // 我创建的: '4',

      // flag
      // 1: '进行中',
      // 2: '已结束',
      // 0: '未开始',
      // 3: '驳回',
      // 4: '未审核(作废)',
      // 5: 驳回（已过期）
      // 6: 通过
      let arr = [];

      const flag_notStart = '0';
      const flag_inProgress = '1';
      const flag_over = '2';
      // 驳回
      const flag_reject = '3';
      // 未审核(作废)
      // const flag_void = '4';
      // 驳回（已过期）
      // const flag_reject_timeOut = '5';
      // 通过;
      const flag_pass = '6';
      // 会议超期
      // const timeOut = 'timeOut';
      const noTimeOut = 'no_timeOut';
      const reviewPass = 'pass';
      const reviewNot = 'not';

      if (['project'].includes(this.where)) {
        if ([0, 1, 2, 6].includes(this.Data.flag)) {
          if (reviewPass === this.NeedReview || reviewNot === this.NeedReview) {
            if (this.IsHost || this.IsJoin) {
              arr.push({
                text: '会议纪要',
                code: 'summary',
                controlShow: [flag_notStart, flag_inProgress, flag_over, noTimeOut, reviewPass, reviewNot],
              });
            }
          }
        }
        if (this.IsAudit) {
          arr.push({
            text: '通过',
            code: 'pass',
            controlShow: [flag_notStart, reviewPass, reviewNot],
          }, {
            text: '驳回',
            code: 'reject',

            controlShow: [flag_notStart, reviewPass, reviewNot],
          }, {
            text: '删除',
            code: 'delete',
            controlShow: [flag_notStart, flag_reject, flag_pass, reviewNot],
          }, {
            text: '编辑',
            code: 'edit',
            controlShow: [flag_notStart, flag_reject, flag_pass, reviewNot],
          });
        }
        if (this.IsCreate) {
          arr.push({
            text: '删除',
            code: 'delete',
            controlShow: [flag_notStart, flag_reject, flag_pass, reviewNot],
          }, {
            text: '编辑',
            code: 'edit',
            controlShow: [flag_notStart, flag_reject, flag_pass, reviewNot],
          });
        }

        return _.uniqBy(arr, 'code');
      }

      switch (this.OperaType) {
        case '1':
          arr = [{
            text: '会议纪要',
            code: 'summary',
            controlShow: [flag_notStart, flag_inProgress, flag_over, noTimeOut, reviewPass, reviewNot],
          }];
          break;
        case '2':
          arr = [{
            text: '会议纪要',
            code: 'summary',
            controlShow: [flag_notStart, flag_inProgress, flag_over, noTimeOut, reviewPass, reviewNot],

          }];
          break;
        case '3':
          arr = [{
            text: '通过',
            code: 'pass',
            controlShow: [flag_notStart, reviewPass, reviewNot],
          }, {
            text: '驳回',
            code: 'reject',

            controlShow: [flag_notStart, reviewPass, reviewNot],
          }, {
            text: '删除',
            code: 'delete',
            controlShow: [flag_notStart, flag_reject, flag_pass, reviewNot],
          }, {
            text: '编辑',
            code: 'edit',
            controlShow: [flag_notStart, flag_reject, flag_pass, reviewNot],
          }];
          break;
        case '4':
          arr = [{
            text: '删除',
            code: 'delete',
            controlShow: [flag_notStart, flag_reject, flag_pass, reviewNot],

          }, {

            text: '编辑',
            code: 'edit',
            controlShow: [flag_notStart, flag_reject, flag_pass, reviewNot],
          }];
          break;
        default:
          break;
      }
      return arr;
    },
  },
  render(h) {
    const self = this;
    const showButtons = [];
    for (const i of self.Options) {
      if (i.controlShow.length) {
        if (self.isTimeOut === 'no_timeOut') {
          if (i.controlShow.includes(this.NeedReview)) {
            if (i.controlShow.includes(self.isTimeOut)) {
              showButtons.push(i);
            } else if (i.controlShow.includes(self.FlagState)) {
              showButtons.push(i);
            }
          }
        }
      }
    }
    showButtons.unshift({
      text: '查看',
      code: 'look',
    });

    const buttons = showButtons.map((e) => {
      return h('el-button', {
        props: {
          type: 'text',
        },
        domProps: {
          innerText: e.text,
        },
        on: {
          click: function (v) {
            self.$emit('click', e.code);
          },
        },
      });
    });
    return h('div', {}, buttons);
  },

};
</script>

<style>

</style>
