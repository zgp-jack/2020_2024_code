<!--  -->
<template>
  <el-popover
    placement="bottom"
    width="500"
    trigger="hover"
    :open-delay="300"
    @show="hoverColumn"
  >
    <div v-loading="loading" class="popover-container">
      <template v-if="result.length">
        <el-timeline>
          <el-timeline-item
            v-for="(v, i) in result"
            :key="i"
            placement="top"
            hide-timestamp
          >
            <el-row class="list-item-top">
              <el-col :span="10">
                <span>
                  {{ v.processTime }}
                </span>
              </el-col>
              <el-col :span="7">
                <span>
                  创建人: {{ v.createUser | member }}
                </span>
              </el-col>
              <el-col :span="7"> 进度：{{ v.compRate || 0 }}% </el-col>
            </el-row>
            <el-row>
              <el-tag
                v-if="v.processType"
                size="mini"
                :type="options[v.processType].type"
              >
                {{ options[v.processType].text }}
              </el-tag>
              <el-col :span="24" class="list-item-bottom">
                任务名称:{{ v.taskName || '-' }}
              </el-col>
              <el-col :span="24" class="list-item-bottom">
                处理内容: {{ v.explan || "-" }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="list-item-bottom">
                <el-row
                  v-if="
                    typeof v.attachment !== 'null' &&
                      v.attachment &&
                      v.attachment != '[]'
                  "
                  class="attachment-wrapper"
                >
                  <el-col :span="3" class="attachment-wrapper-left">
                    <span>附件</span>
                  </el-col>
                  <el-col :span="21" class="attachment-wrapper-right">
                    <ul>
                      <li
                        v-for="(item, ind) in strifyToArr(v.attachment)"
                        :key="ind"
                        class="attachment-wrapper-right-row"
                        @mouseenter="mouseEnter(v.id + ind)"
                        @mouseleave="mouseLeave"
                      >
                        <div class="attachment-wrapper-right-row-left">
                          <img :src="fileIcon" alt="">
                        </div>
                        <div class="attachment-wrapper-right-row-center">
                          <span>{{ item.name }}</span>
                        </div>
                        <div
                          v-show="showIconIndex === v.id + ind"
                          class="attachment-wrapper-right-row-right"
                        >
                          <i
                            class="el-icon-download down-icon"
                            @click="downLoad(item.url)"
                          />
                        </div>
                      </li>
                    </ul>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-timeline-item>
        </el-timeline>
      </template>
      <el-result v-else icon="info" title="暂无数据" />
    </div>

    <span slot="reference">{{ Value }}</span>
  </el-popover>
</template>

<script>
import TaskApi from '@/apis/synthesize/taskManagement';
import { stringifyToArr, } from '@/filters';
import { mapState, } from 'vuex';
export default {
  name: 'PrrcessTimeLine',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    id: {
      type: Number,
      default: 0,
    },
    state: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      result: [],
      loading: false,
      showIconIndex: 0,
      fileIcon: require('@/assets/project/icons/file1.png'),

      options: {
        1: { text: '创建任务', type: 'info', },
        2: { text: '提交任务', type: '', },
        3: { text: '转交任务', type: 'info', },
        4: { text: '暂停任务', type: 'warning', },
        5: { text: '开启任务', type: '', },
        6: { text: '终止任务', type: 'danger', },
        7: { text: '审核完成', type: 'success', },
        8: { text: '审核驳回', type: 'danger', },
        9: { text: '处理任务', type: 'success', },
        10: { text: '完成任务', type: 'success', },
      },
    };
  },
  computed: {
    ...mapState('login', {
      baseUrl: (v) => {
        return v['uriConfig'].fileBaseUri;
      },
    }),
    Value() {
      return (this.value || 0) + '%';
    },
  },
  mounted() {},
  methods: {
    mouseEnter(index) {
      this.showIconIndex = index;
    },
    mouseLeave() {
      this.showIconIndex = -1;
    },
    isImg(fix) {
      const imgReg = /(JPG|PNG|GIF|JPEG)/i;
      return imgReg.test(fix);
    },
    downLoad(url) {
      window.open(url, '_blank');
    },
    strifyToArr(data) {
      const value = stringifyToArr(data);
      const val = [];
      const suffix_reg = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      for (const i of value) {
        val.push({
          name: i.name.replace(suffix_reg, ''),
          suffix: i.name.match(suffix_reg)[1],
          url: this.baseUrl + i.url,
        });
      }
      return val;
    },
    async  hoverColumn() {
      this.result = [];
      this.loading = true;
      this.result = await TaskApi.processList(this.id);
      this.loading = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.popover-container {
  height: 200px;
  overflow: auto;
  &::-webkit-scrollbar-thumb {
    background-color: #e2e3e7;
    border-radius: 3px;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }
}
.list-item-top {
  span {
    font-size: 14px;
    font-weight: 400;
    color: #2d405e;
  }
}
.list-item-bottom {
  color: #879bba;
  font-size: 14px;
}
.t-r {
  text-align: right;
}
.attachment {
  &-wrapper {
    // display: flex;
    // flex-direction: row;
    &-left {
      // width: 10%;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #7d8db3;
        margin-top: 6px;
        display: inline-block;
      }
    }

    &-right {
      > ul {
        list-style: none;
      }
      &-row {
        margin-bottom: 12px;
        height: 32px;
        padding: 0 7px;
        line-height: 32px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        border-radius: 4px;
        &:hover {
          background: #e1e8f8;
        }
        &-left {
          display: flex;
          align-items: center;
          width: 10%;
          img {
            width: 16px;
            height: 16px;
          }
        }
        &-center {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          > span {
            font-size: 14px;
            font-weight: 400;
            color: #426ed7;
          }
        }
        &-right {
          width: 10%;
          text-align: center;
          flex-basis: auto;
          > .down-icon {
            font-weight: 600;
            font-size: 16px;
            color: #426ed7;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
