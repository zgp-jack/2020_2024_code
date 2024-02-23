<template>
  <el-collapse v-model="activeName" accordion>

    <el-collapse-item v-for="(item,index) in dataList" :key="index" :title="item.taskName" name="1">
      <div class="box">
        <el-timeline>
          <el-timeline-item
            v-for="(v, i) in item.dealRecords"
            :key="i"
            placement="top"
            hide-timestamp
          >
            <el-row class="list-item-top">
              <el-col :span="12">
                <span>
                  {{ v.handleTime }}
                </span>
                <span class="handlerToName">
                  {{ v.handlerToName }}
                </span>
              </el-col>
              <el-col :span="12" class="t-r">
                <span>进度:{{ v.progress }}</span>
              </el-col>
            </el-row>

            <el-row class="list-item-content">
              <el-col :span="4">
                <label>处理内容</label>
              </el-col>
              <el-col :span="20">
                <span>{{ v.content }}</span>
              </el-col>
            </el-row>

            <el-row v-if="v.enclosure !=''" class="list-item-enclosure">
              <el-col :span="4">
                <label> 附件</label>

              </el-col>
              <el-col :span="20">
                <ul class="ul">
                  <li
                    v-for="(item, ind) in strifyToArr(v.enclosure)"
                    :key="ind"
                    class="row"
                    @mouseenter="mouseEnter(ind)"
                    @mouseleave="mouseLeave"
                  >
                    <div
                      class="row-content"
                      :class="showIconIndex === ind ?'hover-class':'' "
                    >
                      <i class="el-icon-folder icon" />
                      <div class="folder-name">
                        <span>{{ item.name }}</span>
                      </div>
                      <span>.{{ item.suffix }}</span>

                      <div v-show="showIconIndex === ind" style="flex: 1;text-align: right;">
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
      </div>
    </el-collapse-item>

  </el-collapse>
</template>

<script>
import downLoadFile from '@/utils/downLoad';

export default {
  props: {
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
      activeName: '1',

    };
  },
  methods: {
    downLoad(row) {
      downLoadFile(row.url, row.name);
    },
    mouseEnter(index) {
      this.showIconIndex = index;
    },
    mouseLeave() {
      this.showIconIndex = -1;
    },
    strifyToArr(data) {
      const value = this.$options.filters.stringifyToArr(data);
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
  },
};
</script>

<style lang="scss" scoped>
.box{
  background-color: #F5F6F7;
  padding: 8px;
}
::v-deep .el-timeline-item__node--normal {
  left: 0 !important;
}
::v-deep .el-timeline-item__wrapper {
  top: 0;
}
::v-deep .el-collapse-item__content{
  padding-bottom:0 !important
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.handlerToName{
  margin-left: 16px;
}
.t-r{
  text-align: right;
}
.list {
  &-item {
    &-top {
      font-size: 14px;
      font-weight: 400;
      color: #E6A945;

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
            line-height: 1.5;
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
