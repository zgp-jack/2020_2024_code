<!-- 项目总结的流程列表 -->

<template>
  <el-timeline>
    <el-timeline-item
      v-for="(v, i) in dataList"
      :key="i"
      placement="top"
      hide-timestamp
    >
      <el-row class="list-item-top" :style="Style">
        <el-col :span="12">
          {{ v.createTime }}
        </el-col>
        <el-col :span="12">
          {{ v.createUserToName }}
        </el-col>
      </el-row>

      <el-row class="list-item-content">
        <el-col class="t-r" :span="4">
          <label>总结内容</label>
        </el-col>
        <el-col class="m-l-8" :span="20">
          <span>{{ v.content }}</span>
        </el-col>
      </el-row>

      <el-row v-if="v.enclosure.length " class="list-item-enclosure">
        <el-col class="t-r" :span="4">
          <label> 附件</label>
        </el-col>
        <el-col class="m-l-8" :span="20">
          <ul class="ul">
            <li
              v-for="(item, ind) in strifyToArr(v.enclosure)"
              :key="ind"
              class="row"
              @mouseenter="mouseEnter(ind + item.uid)"
              @mouseleave="mouseLeave"
            >
              <div
                class="row-content"
                :class="showIconIndex === ind + item.uid ?'hover-class':'' "
              >
                <i class="el-icon-folder icon" />
                <div class="folder-name">
                  <span>{{ item.name }}</span>
                </div>
                <span>.{{ item.suffix }}</span>

                <div v-show="showIconIndex === ind + item.uid" style="flex: 1;text-align: right;">
                  <i
                    class="el-icon-download down-icon"
                    @click="downLoad(item)"
                  />
                </div>
              </div>
            </li>
          </ul>
        </el-col>

      </el-row>

    </el-timeline-item>
  </el-timeline>
</template>

<script>
import downLoadFile from '@/utils/downLoad';
import { mapState, } from 'vuex';
export default {
  props: {
    // 控制 字体颜色
    type: {
      type: String,
      // dialog || popver
      default: 'dialog',
    },
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      showIconIndex: 0,
    };
  },
  computed: {
    Style() {
      return {
        color: this.type === 'dialog' ? '#E6A945' : '#2d405e',
      };
    },
    ...mapState('login', {
      baseUrl: (v) => {
        return v['uriConfig'].fileBaseUri;
      },
    }),
  },
  methods: {
    downLoad(row) {
      downLoadFile(row.url, row.downName);
    },
    mouseEnter(index) {
      this.showIconIndex = index;
    },
    mouseLeave() {
      this.showIconIndex = -1;
    },
    strifyToArr(data) {
      if (data) {
        const value = this.$options.filters.stringifyToArr(data);
        const val = [];
        const suffix_reg = /\.([0-9a-z]+)(?:[\?#]|$)/i;
        for (const i of value) {
          val.push({
            name: i.name.replace(suffix_reg, ''),
            downName: i.name,
            suffix: i.name.match(suffix_reg)[1],
            url: this.baseUrl + i.url,
            uid: i.uid,
          });
        }
        return val;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-timeline-item__node--normal {
  left: 0 !important;
}
::v-deep .el-timeline-item__wrapper {
  top: 0;
}
.t-r{
  text-align: right;
}
.m{
  &-l{
    &-8{
      margin-left: 8px;
    }
  }
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.list {
  &-item {
    &-top {
      font-size: 14px;
      font-weight: 400;
      // color: #2d405e;
    }
    &-content {
      display: flex;
      margin-top: 16px;
      label {
        font-family: AlibabaPuHuiTi_2_55_Regular;
        font-weight: 400;
        font-size: 18px;
        color: #7d8db3;
        white-space: nowrap;
        min-width: 75px;
      }
      span {
        font-family: AlibabaPuHuiTi_2_55_Regular;
        font-weight: 400;
        font-size: 18px;
        color: #334266;
            // line-height: 1.5;
        // margin-left: 8px;
      }
    }
    &-enclosure {
      display: flex;
      flex: 1;
      width: 100%;
      margin-top: 16px;
      label {
        font-family: AlibabaPuHuiTi_2_55_Regular;
        font-weight: 400;
        font-size: 18px;
        color: #7d8db3;
        white-space: nowrap;
        min-width: 75px;
        text-align: right;
      }
      .ul {
        flex: 1;
      }
    }
  }
}
.row {
  flex: 1;
  margin-bottom: 12px;
  height: 32px;
  padding: 0 7px;
  line-height: 32px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-radius: 4px;
  &:hover {
    background: #e1e8f8;
  }

  &-content {
    display: flex;
    align-items: center;
    > .icon {
      font-size: 14px;
      color: #282828;
    }
    // flex: 1;
  }
}
.folder-name {
  max-width: calc(100% - 100px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  margin-left: 10px;
}
.down-icon {
  font-weight: 600;
  font-size: 16px;
  color: #426ed7;
  cursor: pointer;
}

.list-item-bottom {
  color: #879bba;
  font-size: 14px;
}

.hover-class {
  color: #426ed7 !important;
}
</style>
