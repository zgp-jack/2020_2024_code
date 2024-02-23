<!--  -->
<template>
  <el-container class="mangement-wrapper">
    <el-main>
      <el-container>
        <el-header height="64px" class="tag-header">
          <el-row class="header-row">
            <el-col :span="22">

              <label class="tag-header-label"> 今日可预定会议室:</label>
              <span class="tag-header-span">{{ reserveData.bookable }}个</span>
              <label class="tag-header-label M-L-24"> 约满: </label>
              <span class="tag-header-span">{{ reserveData.booked }}个</span>
              <label class="tag-header-label M-L-24"> 明日可预定会议室: </label>
              <span class="tag-header-span">{{ reserveData.tomorrow }}个</span>

              <el-radio-group v-model="activeFilter" class="M-L-24" size="mini" @change="changeDayRadio">
                <el-radio-button
                  v-for="v in radioFilter"
                  :key="v.code"
                  :label="v.code"
                >
                  {{ v.text }}
                </el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-model="currentDate"
                class="M-L-24"
                type="date"
                :disabled="activeFilter != 'selectDate'"
                size="mini"
                :clearable="false"
              />

              <label class="tag-header-label M-L-24"> 会议室状态 </label>
              <DicSelect v-model="state" size="small" :type="'number'" :dic-key="'meeting_room_state'" style="width:auto" />

            </el-col>
            <el-col :span="2" class="t-r">
              <pure-button label="预定会议" @click="clickReserve" />
            </el-col>
          </el-row>
        </el-header>
        <el-main ref="elMain" style="overflow: hidden !important">
          <div v-loading="mainLoading" class="hyy">
            <section ref="leftFixed" class="hyy-left">
              <header class="hyy-head-left">
                <ul class="hyy-head-left-ul">
                  <li>
                    <span> {{ currentDate | date('MM月DD日') }}会议预定情况 </span>
                  </li>
                </ul>
              </header>

              <main ref="leftMain" class="hyy-left-main">
                <div v-for="v in resizeData" :key="v.id" class="item-row">
                  <First :info="v.firstData" />
                </div>
              </main>
            </section>

            <section ref="rightMain" class="hyy-right">
              <header ref="head" class="hyy-head-right">
                <ul ref="ul" class="hyy-head-right-ul">
                  <li v-for="v in HeadData" :key="v.label">
                    <span>
                      {{ v.label }}
                    </span>
                  </li>
                </ul>
              </header>

              <main class="hyy-right-main">
                <div
                  class="hyy-right-main-content"
                  :style="`width:${mainWidth}`"
                >
                  <div v-for="v in resizeData" :key="v.id" class="item-row">
                    <div
                      v-for="(item, ind) in v.nextData"
                      :key="ind"
                      class="item-row-child"
                      :style="`left:${item.left}px; width:${item.width}px;`"
                    >
                      <el-popover
                        placement="bottom"
                        width="auto"
                        trigger="hover"
                      >
                        <Content slot="reference" :info="item" @click="clickItem" />
                        <Content :info="item" />
                      </el-popover>
                    </div>
                  </div>
                </div>
              </main>
            </section>
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { mapActions, } from 'vuex';
import { getDicValue, } from '@/filters';
import { arrayToString, } from '@/utils/common';
import MeetingMangementApi from '@/apis/synthesize/mettingMangement/index';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import Content from './components/content.vue';
import First from './components/left.vue';
import ReseverPanel from './components/panelGroup/reserve.vue';
import drawerWidth from '@/views/project/common/width/drawer';
export default {
  name: 'Duehyy',
  components: {
    Content,
    First,
    DicSelect,
  },
  data() {
    return {
      mainLoading: false,
      resizeData: [],
      listData: [],
      state: -1,
      currentDate: Date.now(),
      debounceFun: null,
      radioFilter: [
        {
          text: '今日',
          code: 'currentDay',
        },
        {
          text: '明日',
          code: 'nextDay',
        },
        {
          text: '选择日期',
          code: 'selectDate',
        }
      ],
      reserveData: {
        bookable: 0,
        booked: 0,
        tomorrow: 0,
      },
      activeFilter: 'currentDay',
      zIndex: 0,
      mainWidth: '100%',
      // 偏移值
      offsetLeft: 100,
      debounceSetStyle: null,
    };
  },
  computed: {
    ListData() {
      const list = this.listData;
      const arr = [];
      if (list.length) {
        for (let i = 0; i < list.length; i++) {
          arr.push({
            firstData: {
              title: list[i].name,
              userNum: list[i].peopleNumber,
              config: arrayToString(getDicValue(list[i].devices, 'metting_device')),
            },
            nextData: list[i].busMeetingResultDtos?.map((e) => {
              return {
                ...e,
                people: e.number,
                width: 0,
                left: 0,
              };
            }) || [],
          });
        }
        return arr;
      }
      return arr;
    },
    CurrentDate() {
      return moment(this.currentDate).format('YYYY-MM-DD');
    },
    HeadData() {
      const arr = [];
      for (let i = 0; i < 24; i++) {
        arr.push({
          label: String(i).length === 1 ? `0${i}:00` : `${i}:00`,
          prop: String(i).length === 1 ? `0${i}:00` : `${i}:00`,
          width: 0,
        });
      }
      return arr;
    },
  },
  watch: {
    CurrentDate: function () {
      this.debounceFun();
    },
    state: function () {
      this.debounceFun();
    },
  },
  mounted() {
    this.DISPATCHT_GET_USER_LIST();

    this.init();
    this.initReserveInfo();

    this.resizeSetStyle();
    this.listenerScroll();
    this.filterDataMethod();
  },
  destroyed() {
    this.destroyedResizeSetStyle();
  },
  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),

    resizeSetStyle() {
      const self = this;
      self.debounceSetStyle = _.debounce(self.setStyle, 150,);
      window.addEventListener('resize', self.debounceSetStyle, true);
    },
    destroyedResizeSetStyle() {
      const self = this;

      window.removeEventListener('resize', self.debounceSetStyle, true);
    },
    filterDataMethod() {
      this.debounceFun = _.debounce(function (n, o) {
        this.init();
        this.initReserveInfo();
      }, 300);
    },

    clickItem(data) {
      Object.assign(data, { currentDate: this.CurrentDate, });
      this.$drawer({
        width: drawerWidth.larger_pr,
        component: () => <ReseverPanel optionsCode={'updated'} data={data} onDone={this.onDone} />,
      });
    },
    async init() {
      try {
        this.mainLoading = true;
        const rs = await MeetingMangementApi.allRserveList({
          time: this.CurrentDate,
          state: this.state,
        });
        this.listData = rs;
        this.mainLoading = false;

        this.$nextTick(() => {
          this.setStyle();
        });
      } catch (error) {
        this.mainLoading = false;
        this.$message.error(error);
      } finally {
        this.mainLoading = false;
      }
    },
    async  initReserveInfo() {
      this.reserveData = await MeetingMangementApi.meetingBaseInfo({ time: this.CurrentDate, });
    },
    // 日期选择
    changeDayRadio(radioLabel) {
      switch (radioLabel) {
        case 'currentDay':
          this.currentDate = Date.now();
          break;
        case 'nextDay':
          this.currentDate = moment().add(1, 'days');
          break;
        default:
          break;
      }
    },
    // 会议预定
    clickReserve() {
      this.$drawer({
        width: drawerWidth.medium_pr,
        component: () => <ReseverPanel optionsCode={'add'} onDone={this.onDone} />,
      });
    },
    onDone() {
      this.init();
      this.initReserveInfo();
    },
    listenerScroll() {
      this.$refs['leftMain'].addEventListener('scroll', (e) => {
        this.$refs['rightMain'].scrollTop = this.$refs['leftMain'].scrollTop;
      });
      this.$refs['rightMain'].addEventListener('scroll', (e) => {
        this.$refs['leftMain'].scrollTop = this.$refs['rightMain'].scrollTop;
      });
    },

    // 计算展开宽度
    expandWidth(data) {
      const { startTime, endTime, } = data;
      const { hour, minute, } = this._timeDiff(startTime, endTime);
      const hourWidth = this.offsetLeft * hour;
      const minuteWidth = (minute / 60) * this.offsetLeft;
      const width = hourWidth + minuteWidth;
      return Math.floor(width);
    },
    setStyle() {
      // 获取最大宽度
      const ref = this.$refs;
      const ul = ref['ul'];
      const maxWidth = ul.clientWidth;
      this.mainWidth = maxWidth + 'px';
      this.offsetLeft = ul.childNodes[1].clientWidth + 1;
      // 获取偏移值
      this.setLineOffset();
    },
    timeOffset(endTime) {
      const { hour, minute, } = this._timeDiff('', endTime);
      const hourWidth = this.offsetLeft * hour;
      const minuteWidth = (minute / 60) * this.offsetLeft;
      const offsetPosition = hourWidth + minuteWidth;
      return Math.floor(offsetPosition);
    },
    _timeDiff(startTime, endTime) {
      const unit = 'hh:mm';
      const time = startTime || '00:00';
      const _strartTime = moment(time, unit);
      const _endTime = moment(endTime, unit);
      const _diffMinute = _endTime.diff(_strartTime, 'minute');// 计算相差的分钟数
      const hour = Math.floor(_diffMinute / 60);
      const minute = _diffMinute % 60;
      return { hour, minute, };
    },
    setLineOffset() {
      for (const val of this.ListData) {
        for (const item of val.nextData) {
          item.left = this.timeOffset(item.startTime);
          item.width = this.expandWidth(item);
        }
      }

      this.resizeData = this.ListData;
    },
  },
};
</script>
<style lang='scss' scoped>
.mangement {
  &-wrapper {
    background-color: #fff;
  }
}
.M {
  &-L {
    &-24 {
      margin-left: 24px;
    }
  }
}
.t-r {
  text-align: right;
}
.tag {
  &-header {
    padding: 0 16px;
    &-label {
      font-size: 18px;
      font-weight: 400;
      color: #7d8db3;
    }
    &-span {
      font-size: 18px;
      font-weight: 400;
      color: #334266;
    }
  }
}
.header-row {
  height: 100%;
  display: flex;
  align-items: center;
}
.pagination {
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.hyy {
  display: flex;
  flex-direction: row;
  &-container {
    width: 100%;
    border: 0;
    border-collapse: collapse;
    overflow: auto;
    background-color: #f7f8fa;
    height: 100%;
    position: relative;
  }
  &-left {
    // position: fixed;
    width: 300px;
    z-index: 3;
    box-shadow: 0px 0px 6px 0px #6f6f6f;
    background-color: #2d405e;
    &-head {
      background-color: #2d405e;
      height: 40px;
      line-height: 40px;
      text-align: center;
      > span {
        color: #fff;
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
      }
    }
    &-main {
      box-sizing: border-box;
      height: 700px;
      overflow: auto;
      &::-webkit-scrollbar{
        display: none;
      }
      > .item-row {
        box-shadow: 0px 1px 0px 0px #ccc;
      }
    }
  }
  &-right {
    overflow: auto;
    &::-webkit-scrollbar-thumb {
      background-color: #f7f8fa;
      border-radius: 3px;
    }
    &-main {
      box-sizing: border-box;
      height: 700px;
      &-content {
        display: flex;
        flex-direction: column;
        > .item-row {
          height: 120px;
          box-shadow:  0 1px #c0c4cc;
          position: relative;
          > .item-row-child {
            margin: 5px 0px;
            cursor: pointer;
            // width: 100px;
            position: absolute;
            transition: all 0.3s ease;
            top: 0;
            bottom: 0;

            &:hover {
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
              z-index: 999;
            }
          }
        }
      }
    }
  }

  &-head {
    position: sticky;
    top: 0;
    z-index: 1;
    &-right {
      position: sticky;
      top: 0;
      z-index: 5;
      &-ul {
        height: 40px;
        line-height: 40px;
        box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.24);
        list-style: none;
        display: inline-flex;
        padding: 0;
        margin: 0;
        background-color: #fff;

        > li {
          border: none;
          text-align: center;
          border: 1px solid #ecf0f7;
          border-left: none;
          box-sizing: border-box;
          & {
            width: 100px;

            > span {
              font-size: 14px;
              font-weight: 600;
              text-align: center;
              color: #909399;
            }
          }
        }
      }
    }

    &-left {
      &-ul {
        height: 40px;
        line-height: 40px;
        box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.24);
        list-style: none;
        display: inline-flex;
        padding: 0;
        margin: 0;
        background-color: #fff;
        > li {
          border: none;
          text-align: center;
          // border: 1px solid #ecf0f7;
          border-left: none;
          box-sizing: border-box;
          width: 300px;
          > span {
            color: #fff;
            font-size: 16px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
          }
          background-color: #2d405e;
        }
      }
    }
  }
}
</style>
