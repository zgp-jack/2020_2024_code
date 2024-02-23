<!--  -->
<template>
  <el-popover
    placement="bottom"
    :width="400"
    trigger="hover"
    popper-class="customPopver"
    :close-delay="100"
    :open-delay="600"
    @show="hoverColumn"
    @hide="onHiden"
  >
    <template #default>
      <div v-loading="loading" class="popver_wrapper">
        <el-timeline v-if="result && result.length ">
          <el-timeline-item
            v-for="(v, i) in result"
            :key="i"
            placement="top"
            hide-timestamp
          >
            <el-row class="list-item-top">
              <el-col :span="12">
                <span>
                  {{ v.createTime }}
                </span>
              </el-col>
              <el-col :span="5">
                <span>
                  {{ v.users }}
                </span>
              </el-col>
              <el-col :span="7">
                <span v-if="v.progress != null"> 进度：{{ v.progress }}% </span>
                <span v-else>
                  <el-tag size="mini">补充</el-tag>
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="list-item-bottom">
                处理内容:{{ v.remark || '-' }}
              </el-col>

              <el-col :span="24" class="list-item-bottom">
                <el-row v-if="v.enclosure !== '[]'" class="attachment-wrapper">
                  <el-col :span="3" class="attachment-wrapper-left">
                    <span>附件</span>
                  </el-col>
                  <el-col :span="21" class="attachment-wrapper-right">
                    <ul>
                      <li
                        v-for="(item, ind) in strifyToArr(v.enclosure)"
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
                          v-show="showIconIndex === (v.id + ind)"
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
        <el-result v-if="result && !result.length " icon="info" title="暂无数据!" />
      </div>
    </template>
    <span slot="reference">{{ value }}</span>
  </el-popover>
</template>

<script>
import ProjectAPI from '@/apis/project';
import { mapState, } from 'vuex';
import { stringifyToArr, } from '@/filters';
export default {
  name: 'PrrcessTimeLine',

  props: {
    value: {
      type: String,
      default: '',
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      result: null,
      loading: false,
      loadingSuccess: false,
      loadingEmpty: false,
      fileIcon: require('@/assets/project/icons/file1.png'),
      showIconIndex: 0,
    };
  },
  computed: {
    ...mapState('login', {
      baseUrl: (v) => {
        return v['uriConfig'].fileBaseUri;
      },
    }),
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

    downLoad(url) {
      window.open(url, '_blank');
    },
    onHiden() {
      this.result = null;
    },
    async hoverColumn() {
      this.loading = true;
      this.result = await ProjectAPI.impose.taskInjectHistory(this.id);
      this.loading = false;
      this.result.reverse();
    },

  },
};
</script>
<style lang='scss' scoped>
.popver_wrapper {
  height: auto;
  min-height: 200px;
  max-height: 400px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e2e3e7;
    border-radius: 3px;
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
        display: inline-block;
        margin-top: 6px;
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
