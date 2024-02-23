<!-- 巡检模板设置 -->
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
        <el-header style="display:flex;align-items:center;padding-left:30px;border-bottom:1px solid #f2f6fc;;">
          <!-- <el-button :class="{'btnColor':!changeTable}" size="mini" type="primary" plain @click="changeSetUpTable">模板设置</el-button>
          <el-button :class="{'btnColor':changeTable}" size="mini" type="primary" plain style="margin:0;" @click="changeRelationTable">模板关联</el-button> -->
          <pure-btn-group :options="btnOptions" default-active="模板设置" @change="handleTabChange" />
        </el-header>
        <el-main>
          <el-container>
            <el-aside style="padding: 80px 0 0 6px;margin: 0 !important;" width="30px"><i class="icon-setting" /></el-aside>
            <el-main style="padding-right:30px;">
              <el-header
                style="display:flex;
                    justify-content: space-between;
                    align-items: center;"
              >
                <Search />
                <el-button v-if="!changeTable" type="primary" style="width:100px;" size="mini" @click="addTemplate">新增模板</el-button>
                <el-button v-if="changeTable&&filterTabledata == '巡检单元'" style="width:100px;" type="primary" size="mini" @click="addUnit">新增</el-button>
              </el-header>
              <el-main class="patrolTemplate-table">
                <SetUp v-if="!changeTable&&filterTabledata == '资产类型'" ref="setup" />
                <Relation v-else-if="changeTable&&filterTabledata == '资产类型'" />
                <module-association v-else-if="changeTable&&filterTabledata == '巡检单元'" />
              </el-main>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
    <SwitchSelection v-if="changeTable" :switch-selection-label="switchSelectionLabel" @filterTable="filterTable($event)" />
  </el-container>
</template>

<script>
import Today from '@/components/today';
import SwitchSelection from '@/views/inspection/components/switchSelection';
import Search from '@/components/input/search.vue';
import SetUp from '@/views/inspection/patrolTemplate/table/setUp';
import Relation from '@/views/inspection/patrolTemplate/table/relation';
import CreateTemplate from './dialog/createTemplate.vue';
import AddUnitDialog from '@/views/inspection/components/dialog/addUnitDialog';
import ModuleAssociation from './table/moduleAssociation.vue';
export default {
  components: {
    Today,
    SwitchSelection,
    Search,
    SetUp,
    Relation,
    ModuleAssociation,
    PureBtnGroup: () => import('@/components/button/buttonGroup.vue'),
  },
  data() {
    return {
      filterTabledata: '资产类型',
      changeTable: false,
      btnOptions: [{
        name: '模板设置',
      }, {
        name: '模板关联',
      }],
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
      templatesList: null,
    };
  },
  methods: {
    addUnit() {
      const res = { istype: 0, };
      this.$drawer({
        width: '1400px',
        position: 'right-bottom',
        component: () => <AddUnitDialog onDone={this.closeAddDialog} unitData={res} />,
      });
    },
    closeAddDialog() {},
    handleTabChange(val) {
      switch (val) {
        case '模板设置':
          this.changeSetUpTable();
          break;
        case '模板关联':
          this.changeRelationTable();
          break;
      }
    },
    filterTable(e) {
      console.log(e);
      this.filterTabledata = e;
    },
    changeSetUpTable() {
      this.changeTable = false;
      this.filterTabledata = '资产类型';
    },
    changeRelationTable() {
      this.changeTable = true;
    },
    addDone() {
      this.$refs.setup.setupGetData();
    },
    addTemplate() {
      this.$drawer({
        width: '1400px',
        position: 'right-bottom',
        component: () => <CreateTemplate onDone={this.addDone} onReloadData={this.fetchData}/>,
      });
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
.btnColor{
    background-color: #1890ff;
    color: #fff;
}
.patrolTemplate-table{
  height:calc(100% - 60px);
}
</style>
