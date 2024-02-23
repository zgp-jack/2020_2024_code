<!--  -->
<template>
  <el-popover
    placement="bottom"
    :width="460"
    trigger="hover"
    popper-class="big-screen-popper-task-handle"
    @show="hoverColumn"
  >
    <template #default>
      <div v-loading="loading" class="popver_wrapper">
        <el-timeline v-if="result.length" class="timeline-wrapper">
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
                  <!-- <el-tag size="mini">补充</el-tag> -->
                  <Tag>补充</Tag>
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="list-item-bottom">
                处理内容: <span> {{ v.remark || '-' }}</span>
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
                          <i class="el-icon-folder" />
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
        <el-result v-else icon="info" title="暂无数据!" />
      </div>
    </template>
    <span slot="reference">{{ value }}</span>
  </el-popover>
</template>

<script>
import ProjectAPI from '@/apis/project';
import _ from 'lodash';
import { mapState, } from 'vuex';
import { stringifyToArr, } from '@/filters';
import Tag from '../tag/index.vue';
export default {
  name: 'PrrcessTimeLine',
  components: {
    Tag,
  },
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
      result: [],
      loading: false,
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
    async hoverColumn(r) {
      this.loading = true;
      _.delay(async () => {
        this.result = await ProjectAPI.impose.taskInjectHistory(this.id);
        this.result.reverse();
        this.loading = false;
      }, 600);
    },
  },
};
</script>
<style  lang="scss">
@import "~@/feat/bigScreen/style/linearGradient.scss";

.big-screen-popper-task-handle{
  @extend .boderLinearGradient;
background: #01070d;
border: 1px solid #062440;
box-shadow: 0px 20px 40px 10px #000c1a, 0px 10px 20px 0px rgba(24,144,255,0.15);
}
</style>
<style lang='scss' scoped>
@import "~@/feat/bigScreen/style/timeLine.scss";
::v-deep .el-popper[x-placement^=bottom] .popper__arrow::after{
      top: 0px;
    border-bottom-color: #2f4f87;
}
::v-deep .el-popper[x-placement^=bottom] .popper__arrow{
      border-bottom-color: #2f4f87;
}
.timeline-wrapper{
  margin-top: 10px ;
}
.popver_wrapper {
  height: auto;
  max-height: 400px;
  overflow: auto;
  padding: 0 6px;
  &::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #1890FF;
    border-radius: 0px;
  }
}
.list-item-top {
  span {
    font-size: 18px;
    font-weight: 400;
    color: #fff;
  }
}
.list-item-bottom {
  color: #8b99ad;
  font-size: 18px;
  >span{
  color: #fff;
  }
}
.attachment {
  &-wrapper {
    &-left {
      span {
        font-size: 18px;
        font-weight: 400;
        color: #8b99ad;
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
          background: #3b3f43;
        }
        &-left {
          display: flex;
          align-items: center;
          width: 10%;
          >i{
            color:#fff;
            font-size: 14px;
          }
        }
        &-center {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          > span {
            font-size: 18px;
            font-weight: 400;
            color: #fff;
          }
        }
        &-right {
          width: 10%;
          text-align: center;
          flex-basis: auto;
          > .down-icon {
            font-weight: 600;
            font-size: 16px;
            color:#1890FF;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
