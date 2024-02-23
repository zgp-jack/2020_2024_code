<!-- 巡检任务 -->
<template>
  <el-container style="height:100%;">
    <el-aside style="width: 240px; height: 100%">
      <el-container>
        <el-header>
          <Today />
        </el-header>
      </el-container>
    </el-aside>
    <el-main>
      <el-container>
        <el-aside style="padding: 80px 0 0 6px;margin: 0 !important;" width="30px"><i class="icon-setting" /></el-aside>
        <el-main>
          <el-container style="padding-right:30px;">
            <el-header class="record-header" height="60px">
              <el-row
                type="flex"
                align="middle"
                justify="space-between"
              >
                <el-col :span="4">
                  <search />
                </el-col>
                <el-col :span="12" align="right">
                  <el-button size="mini" class="btn">打印</el-button>
                </el-col>
              </el-row>
            </el-header>
            <el-main>
              <inspectionUnitTable v-show="!isTable" />
              <assetsTable v-show="isTable" />
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
    <SwitchSelection :switch-selection-label="switchSelectionLabel" @filterTable="filterTable($event)" />
  </el-container>
</template>

<script>
import SwitchSelection from '@/views/inspection/components/switchSelection';
import Today from '@/components/today';
import Search from '@/components/input/search.vue';
import assetsTable from './table/assetsTable';
import inspectionUnitTable from './table/inspectionUnitTable';
export default {
  components: {
    SwitchSelection,
    Today,
    Search,
    assetsTable,
    inspectionUnitTable,
  },
  data() {
    return {
      isTable: true,
      switchSelectionLabel: [
        {
          lable: '资产类型',
          data: [
            { label: '计算机设备',
              children: [
                {
                  label: '台式电脑',
                },
                {
                  label: '笔记本',
                },
                {
                  label: 'mini主机',
                }],
            },
            { label: '计算机设备',
              children: [
                {
                  label: '台式电脑',
                },
                {
                  label: '笔记本',
                },
                {
                  label: 'mini主机',
                }],
            }
          ],
        },
        {
          lable: '科室',
          data: [
            { label: '计算机设备',
              children: [
                {
                  label: '台式电脑',
                },
                {
                  label: '笔记本',
                },
                {
                  label: 'mini主机',
                }],
            },
            { label: '计算机设备',
              children: [
                {
                  label: '台式电脑',
                },
                {
                  label: '笔记本',
                },
                {
                  label: 'mini主机',
                }],
            }
          ],
        },
        {
          lable: '巡检单元',
          data: [
            { label: '计算机设备',
              children: [
                {
                  label: '台式电脑',
                },
                {
                  label: '笔记本',
                },
                {
                  label: 'mini主机',
                }],
            },
            { label: '计算机设备',
              children: [
                {
                  label: '台式电脑',
                },
                {
                  label: '笔记本',
                },
                {
                  label: 'mini主机',
                }],
            }
          ],
        }
      ],
    };
  },
  methods: {
    filterTable(e) {
      if (e === '巡检单元') {
        this.isTable = false;
      } else {
        this.isTable = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
    .el-container ::v-deep .el-aside {
  background: white;
  margin: 0 10px 0 0;
}
.el-container ::v-deep .el-main {
  background: white;
}
.record-header{
  padding-top: 15px;
  .btn{
    border: 1px solid #409eff;
    border-color: #409eff;
    color: #409eff;
    width: 80px;
    padding-left: 0;
    padding-right: 0;
  }
}
.timeline::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.timeline::-webkit-scrollbar-thumb {
  background-color: #D7E5F9;
  border-radius: 3px;
}
</style>
