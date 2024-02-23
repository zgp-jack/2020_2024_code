<!-- 任务处理面板 -->
<template>
  <Panel
    :header-top="{
      title:'项目信息',
      text:`创建人:${panelInfo.injectUser}`
    }"
  >
    <el-row class="list-item-top">
      <el-col :span="12">
        <span>
          {{ taskHandleData.time }}
        </span>
      </el-col>
      <el-col :span="5">
        <span>
          {{ taskHandleData.userName }}
        </span>
      </el-col>
      <el-col :span="7">
        <span v-if="taskHandleData.processNum != null"> 进度：{{ taskHandleData.processNum }}% </span>
        <span v-else>
          <Tag>补充</Tag>
        </span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="list-item-bottom">
        处理内容: <span> {{ taskHandleData.remark || '-' }}</span>
      </el-col>

      <el-col :span="24" class="list-item-bottom">
        <el-row v-if="taskHandleData.enclosure !== '[]'" class="attachment-wrapper">
          <el-col :span="3" class="attachment-wrapper-left">
            <span>附件</span>
          </el-col>
          <el-col :span="21" class="attachment-wrapper-right">
            <ul>
              <li
                v-for="(item, ind) in strifyToArr(taskHandleData.enclosure)"
                :key="ind"
                class="attachment-wrapper-right-row"
                @mouseenter="mouseEnter( ind)"
                @mouseleave="mouseLeave"
              >
                <div class="attachment-wrapper-right-row-left">
                  <i class="el-icon-folder" />
                </div>
                <div class="attachment-wrapper-right-row-center">
                  <span>{{ item.name }}</span>
                </div>
                <div
                  v-show="showIconIndex === ind"
                  class="attachment-wrapper-right-row-right"
                >
                  <i
                    class="el-icon-download down-icon"
                    @click="downLoad(item.url,item.name)"
                  />
                </div>
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </Panel>
</template>

<script>

import { arrayToTree, } from '@/utils/common';
import { member, stringifyToArr, } from '@/filters';
import { mapGetters, } from 'vuex';
import _ from 'lodash';
import Panel from '../panel/index.vue';
import Tag from '../tag/index.vue';
import downLoadFile from '@/utils/downLoad';

export default {
  name: 'TaskInfoPanel',
  components: {
    Panel,
    Tag,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    taskHandleData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      panelInfo: {
        injectUser: '',
        injectTime: '',
      },
      showIconIndex: -1,
      loading: null,
    };
  },
  computed: {
    ...mapGetters(['fileBaseUrl']),
    ProjectData() {
      return this.data.info;
    },
    TaskList() {
      return this.data.work;
    },
    TaskListTree() {
      const list = _.cloneDeep(this.TaskList);
      const rs = arrayToTree(list, {
        pfield: 'parentId',
        ufield: 'id',
        sub_name: 'children',
      });
      return rs;
    },

  },
  created() {
    this.init();
  },
  methods: {
    mouseEnter(index) {
      this.showIconIndex = index;
    },
    mouseLeave() {
      this.showIconIndex = -1;
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
    downLoad: downLoadFile,
    init() {
      const rs = this.ProjectData;
      this.panelInfo.injectUser = member(rs?.updateUser || '');
      this.panelInfo.injectTime = rs.updateTime || '';
    },
  },
};
</script>
<style lang='scss' scoped>
.list-item-top {
  height:28px;
  line-height: 28px;
  span {
    font-size: 18px;
    font-weight: 400;
    color: #fff;
  }
}
.list-item-bottom {
  color: #8b99ad;
  font-size: 18px;
  margin-top: 20px;
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
