<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-15 18:30:57
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-22 10:23:47
 * @FilePath: \big-screenc:\Users\cunzhe\Desktop\全院\ywt-vue-qp\src\views\project\impose\components\generateReport\projectFile.vue
 * @Description:
-->
<template>
  <div>
    <div v-if="isTrueData">
      <el-collapse v-model="activeName" accordion>
        <div v-for="(item, idx) in componentData" :key="idx">
          <el-collapse-item
            :title="setTitle(item.module)"
            :name="item.module"
            class="file-collapse"
          >
            <div v-for="(el, index) in item.list" :key="index" class="file-title">
              <div class="title-box">
                <span class="info">
                  {{ el.order }}：<span
                    style="margin: 0 10px; color: #7c7c7c"
                  >已选 </span>{{ isChange(el.list).length }}
                  <span style="margin: 0 5px; color: #7c7c7c">个</span>
                </span>
                <span class="line" />
              </div>
              <div class="file-box">
                <div v-for="(val, indx) in el.list" :key="indx" class="file">
                  <el-checkbox
                    v-model="val.checked"
                    style="margin-right: 5px"
                    @change="changeImg(el.list, val)"
                  />{{ val.name }}
                </div>
              </div>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
    <el-empty v-else class="not-data" description="暂无数据" />
  </div>
</template>

<script>
export default {
  props: {
    componentData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isChangeList: [],
      activeName: '需求管理',
    };
  },
  computed: {
    isTrueData() {
      const type = JSON.stringify(this.componentData);
      if (type === '{}' || type === '[]') {
        return false;
      } else {
        return true;
      }
    },
    setTitle() {
      return key => {
        switch (key) {
          case 'demand':
            return '需求管理';
          case 'itemEstablish':
            return '项目立项';
          case 'implementStart':
            return '项目实施';
          case 'contractInvoice':
            return '合同发票';
          case 'meetingTask':
            return '会议任务';
          case 'faultRepair':
            return '故障报修';
          case 'patrolRepair':
            return '巡检管理';
        }
      };
    },
    isChange() {
      return (list) => {
        return list.filter(item => {
          return item.checked;
        });
      };
    },
  },
  watch: {
    isChangeList: {
      handler(newVal, oldVal) {
        const uidStr = [];
        newVal.length &&
          newVal.forEach(file => {
            uidStr.push(file.uid);
          });
        this.$emit('addUidStr', uidStr);
      },
      immediate: true,
    },
  },
  methods: {
    changeImg(list, val) {
      this.isChangeList = list.filter(item => {
        return item.checked;
      });
      !val.checked && this.$emit('delUidStr', val.uid);
    },
  },
};
</script>

<style lang="scss" scoped>
.enclosure {
  display: flex;
  flex-direction: column;
  align-items: center;
  float: left;
  .img {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
  .img-name {
    text-align: center;
    width: 100px;
    padding: 0 5px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    margin-top: 5px;
    line-height: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
::v-deep.file-collapse {
  .el-collapse-item__header {
    background: rgba(0, 0, 0, 0.06) !important;
    padding: 0 5px;
    font-size: 22px;
    font-weight: 600;
  }
  .el-collapse-item__wrap {
    margin-top: 10px;
    padding: 0 5px;
  }
}
.file-title {
  font-size: 18px;
  .title-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .info {
      width: auto;
      margin-right: 10px;
    }
    .line {
      width: auto;
      height: 1px;
      flex: 1;
      background: #dcdfe6;
    }
  }
}
.file-box {
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  align-items: center;
  justify-content: flex-start;
  .file {
    width: 25%;
    margin: 5px 0;
  }
}
</style>
