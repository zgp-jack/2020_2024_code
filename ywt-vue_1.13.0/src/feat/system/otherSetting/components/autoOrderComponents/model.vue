<!-- 派单模式 -->

<template>
  <el-row>
    <el-col :span="24">
      <el-form ref="form" label-position="top" :inline="false" size="small" :disabled="!isAutoDispatch">
        <el-form-item label="派单模式">
          <el-tabs v-model="tabValue" type="border-card" @tab-click="changeTab">
            <el-tab-pane class="pane-content" name="1">
              <template #label>
                <el-checkbox v-model="deptChecked" @change="changeCheckBox($event,'dept')">
                  根据"报修科室"派单
                </el-checkbox>
              </template>
              <el-row class="h-100" :gutter="16">
                <el-col :span="4" class="h-100 overflow-auto">
                  <el-tree
                    :key="'deptId'"
                    ref="tree"
                    :expand-on-click-node="false"
                    default-expand-all
                    :data="deptTreeList"
                    :node-key="'deptId'"
                    :props="{
                      label: 'deptName',
                      children: 'children'
                    }"
                    empty-text="暂无数据"
                    :highlight-current="true"
                    @node-click="treeDeptNodeClick"
                  />
                </el-col>
                <el-col :span="20">
                  <el-table :data="tableDeptData" border stripe>
                    <el-table-column type="index" label="序号" width="80px" />
                    <el-table-column
                      prop="deptName"
                      label="科室名称"
                      width="280px"
                    />
                    <el-table-column
                      prop="hospitalName"
                      label="所属院区"
                      width="260px"
                    />
                    <el-table-column
                      prop="sendTeamName"
                      label="接单小组/人"
                      width="290px"
                    >
                      <template #default="{row}">
                        {{ row.sendTeamName ||"-" }}{{ row.sendUserName ? `/${row.sendUserName}` : row.sendUserName }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="index" label="操作" width="auto">
                      <template #default="{row}">
                        <el-button
                          v-if="row.id"
                          type="text"
                          @click="choseTeamUser(row, 'edit')"
                        >编辑</el-button>
                        <el-button
                          v-else
                          type="text"
                          @click="choseTeamUser(row, 'add')"
                        >
                          指定接单小组/人
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane class="pane-content" name="2">
              <template #label>
                <el-checkbox v-model="faultTypeChecked" @change="changeCheckBox($event,'faultType')">
                  根据"故障分类"派单
                </el-checkbox>
              </template>
              <el-row class="h-100" :gutter="16">
                <el-col :span="4" class="h-100 overflow-auto">
                  <el-tree
                    :key="'deptId'"
                    ref="tree"
                    :expand-on-click-node="false"
                    :data="dicTreeList"
                    :node-key="'deptId'"
                    default-expand-all
                    :props="{
                      label: 'name',
                      children: 'children'
                    }"
                    empty-text="暂无数据"
                    :highlight-current="true"
                    @node-click="treeDicNodeClick"
                  />
                </el-col>
                <el-col :span="20">
                  <el-table :data="tableDicData" border stripe>
                    <el-table-column type="index" label="序号" width="80" />
                    <el-table-column prop="faultTypeName" label="故障名称" width="280px" />
                    <el-table-column
                      prop="sendTeamName"
                      label="接单小组/人"
                      width="290px"
                    >
                      <template #default="{row}">
                        {{ row.sendTeamName ||'-' }}{{ row.sendUserName ? `/${row.sendUserName}` : row.sendUserName }}
                      </template>
                    </el-table-column>

                    <el-table-column prop="index" label="操作" width="auto">
                      <template #default="{row}">
                        <el-button
                          v-if="row.id"
                          type="text"
                          @click="choseTeamUser(row, 'edit')"
                        >编辑</el-button>
                        <el-button
                          v-else
                          type="text"
                          @click="choseTeamUser(row, 'add')"
                        >
                          指定接单小组/人
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { dataToTree, } from '@/utils/common';
import { mapActions, mapGetters, mapMutations, mapState, } from 'vuex';
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';

export default {
  data() {
    return {
      deptChecked: false,
      faultTypeChecked: false,
      // 模式(1报修科室 2故障分类)
      tabValue: '1',
      tabValueMap: {
        '1': 1,
        '2': 2,
      },
    };
  },
  watch: {
    isDeptChecked(val) {
      this.deptChecked = val;
    },
    isFaultTypeChecked(val) {
      this.faultTypeChecked = val;
    },
  },
  computed: {
    ...mapState('dictionary', {
      dicList: v => {
        return v;
      },
    }),
    ...mapState('systemDepartment', {
      deptList: 'list',
    }),
    ...mapState('systemOtherSetting/autoOrder', ['tableDeptData', 'tableDicData', 'dispatchModeData']),
    ...mapGetters('systemOtherSetting/autoOrder', ['isDeptChecked', 'isFaultTypeChecked', 'isAutoDispatch']),

    orginList() {
      return this.dicList['faultTypeList'];
    },
    deptTreeList() {
      return this.deptList;
    },
    dicTreeList() {
      const d = dataToTree(this.orginList, {
        parentId: 'parent_id',
        id: 'id',
        value: 'value',
      });
      return d;
    },
  },
  mounted() {
    this.GET_DISPATCH_MODE_TABLE_DATA();
  },
  methods: {
    ...mapMutations('systemOtherSetting/autoOrder', ['setTabActivedValue', 'setTreeDeptId', 'setTreeFaultTypeId', 'setDeptId', 'setFaultTypeId']),
    ...mapActions('systemOtherSetting/autoOrder', ['GET_DISPATCH_MODE_TABLE_DATA', 'SET_TEAM_USER', 'SET_DISPATCH_MODE_DATA']),
    changeTab(value) {
      this.setTabActivedValue(this.tabValueMap[this.tabValue]);

      this.GET_DISPATCH_MODE_TABLE_DATA();
    },
    changeCheckBox(value, type) {
      console.log(value, 'sss');
      const data = {
        ...this.dispatchModeData,
      };
      if (type === 'dept') {
        Object.assign(data, {
          orderRuleDept: value ? 1 : 0,
        });
      }
      if (type === 'faultType') {
        Object.assign(data, {
          orderRuleType: value ? 1 : 0,
        });
      }
      console.log(data, 'dadta');
      this.SET_DISPATCH_MODE_DATA(data);
    },
    choseTeamUser(row, type) {
      if (this.tabValue === '1') {
        this.setDeptId(row.deptId);
      } else {
        this.setFaultTypeId(row.faultType);
      }
      const defaultSelectedData = {};
      if (type === 'edit') {
        Object.assign(defaultSelectedData, {
          'engineerId': row.sendUser,
          'teamId': row.sendTeam,
          'isTeam': !row.sendUser,
        });
      }

      this.$innerDrawer({
        width: '548px',
        component: () => (
          <EngineerPanel
            onDone={this.SET_TEAM_USER}
            showOrder={false}
            defaultSelectedData={defaultSelectedData}
          />
        ),
      });
    },

    treeDeptNodeClick(node) {
      this.setTreeDeptId(node.id);
      this.GET_DISPATCH_MODE_TABLE_DATA();
    },

    treeDicNodeClick(node) {
      this.setTreeFaultTypeId(node.id);
      this.GET_DISPATCH_MODE_TABLE_DATA();
    },
  },
};
</script>

<style lang="scss" scoped>
.pane-content {
  padding: 0;
  height: 400px;
  // overflow: auto;
}
.h-100 {
  height: 100%;
}
.overflow {
  &-auto {
    overflow: auto;
  }
}
</style>
