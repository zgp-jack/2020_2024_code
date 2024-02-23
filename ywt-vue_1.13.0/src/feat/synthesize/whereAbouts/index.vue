<template>
  <el-container>

    <el-main height="">
      <PureTable ref="pureTable" :list-api="listApi" :query-condition="queryCondition">
        <template #header>
          <el-row
            type="flex"
            align="middle"
            class="query base-margin-left base-margin-top base-margin-right"
          >
            <el-col :span="12">
              <el-row :gutter="16">
                <el-col :span="10">
                  <el-input v-model="queryCondition.query" size="small" placeholder="姓名/电话/用户名" />
                </el-col>
                <el-col :span="8">
                  <el-select
                    v-model=" whereaboutsIds"
                    size="small"
                    placeholder="选择人员去向"
                    clearable
                    filterable
                    multiple
                    @change="onWhereaboutsChange"
                  >
                    <el-option
                      v-for="item in whereAboutsTagList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-col>
              </el-row>

            </el-col>
            <el-col :span="12" class="t-r">
              <pure-button v-if="IsAddConfig" label="去向配置" type="wire-frame" @click="onWhereConfig" />
            </el-col>

          </el-row>
        </template>

        <template slot="indexColumn">
          序号
        </template>
        <el-table-column label="姓名" prop="name" width="119px" min-width="119px" max-width="119px">
          <template #default="{row}">
            {{ row.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="电话" prop="mblNo" width="162px" min-width="162px" max-width="162px">
          <template #default="{row}">
            {{ row.mblNo || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName" width="192px" min-width="192px" max-width="192px">
          <template #default="{row}">
            {{ row.userName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="科室" prop="deptName" width="263px" min-width="263px" max-width="263px">
          <!--  -->
        </el-table-column>
        <el-table-column label="去向" show-overflow-tooltip>
          <!--  -->
          <template #default="{row}">
            <Tag v-for="(item,index) in row.whereaboutsList" :key="index" size="small" :color="item.colorCode">
              {{ item.name }}
            </Tag>

          </template>
        </el-table-column>
        <el-table-column v-if="IsEdit" label="操作" width="192px" min-width="192px" max-width="192px">
          <template #default="{row}">
            <el-button type="text" @click="onAddWhereabouts(row)">添加去向</el-button>
            <el-button type="text" @click="onEditWhereabouts(row)">编辑</el-button>

          </template>
          <!--  -->
        </el-table-column>

      </PureTable>

    </el-main>
    <el-aside width="288px">
      <collapse>
        <collapse-item>
          <template #title>
            科室
          </template>
          <el-input v-model="deptText" size="small" />
          <el-tree
            ref="tree"
            :data="TreeData"
            node-key="id"
            accordion
            highlight-current
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </collapse-item>
      </collapse>
      <!-- Aside content -->
    </el-aside>

  </el-container>

</template>

<script>
import PureTable from '@/feat/component/pureTable';
import WhereAboutsApi from './api';
import Tag from './component/tag';
import drawerWidth from '@/views/project/common/width/drawer';
import DrawerWhereAboutsConfig from './drawer/config';
import DrawerEdit from './drawer/edit';
import dialogWidth from '@/views/project/common/width/dialog';
import DialogAddUserWhereAbouts from './dialog/addUserWhereAbouts';
import { mapState, } from 'vuex';
// import DepartmentApi from '@/feat/system/department/api';
export default {
  components: {
    PureTable,
    Tag,
  },
  data() {
    return {
      listApi: WhereAboutsApi.getwhereAboutsList,
      departmentList: [],
      deptText: '',
      whereAboutsTagList: [],
      whereaboutsIds: [],
      queryCondition: {
        deptNo: '',
        query: '',
        whereaboutsIds: '',
      },
    };
  },
  computed: {
    TreeData() {
      return this.$store.state.systemDepartment.list;
    },
    ...mapState('login', {
      MyPermissions: (v) => {
        return v.userInfo.permissions || [];
      },

    }),
    IsAddConfig() {
      return this.MyPermissions.includes('USER_WHEREABOUTS_CONFIG');
    },
    IsEdit() {
      return this.MyPermissions.includes('USER_WHEREABOUTS_EDIT');
    },
  },
  watch: {
    deptText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.initDeaprtmentList();
    this.getWhereAboutsTagList();
  },
  methods: {
    onWhereaboutsChange(val) {
      this.queryCondition.whereaboutsIds = val.join(',');
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    async getWhereAboutsTagList() {
      this.whereAboutsTagList = await WhereAboutsApi.whereAboutsOptions();
    },
    handleNodeClick(nodeData) {
      console.log(nodeData);
      this.queryCondition.deptNo = nodeData.deptNo;
    },
    reloadGetTableData() {
      this.$refs.pureTable.fetchData();
    },
    async initDeaprtmentList() {
      // this.departmentList = await DepartmentApi.list({ isHideHospital: 0, });
    },
    // 去向配置
    onWhereConfig() {
      this.$drawer({
        title: '',
        width: drawerWidth.mini_pr,
        component: () => <DrawerWhereAboutsConfig onDone={this.reloadGetTableData} onReload={this.reloadGetTableData} />,
      });
    },
    // 添加去向
    onAddWhereabouts(row) {
      this.$dialog({
        title: '添加去向',
        width: dialogWidth.small_px,
        component: () => <DialogAddUserWhereAbouts itemData={row} onDone={this.reloadGetTableData} />,

      });
    },
    // 编辑
    onEditWhereabouts(row) {
      this.$drawer({
        title: '编辑',
        width: drawerWidth.mini_pr,
        component: () => <DrawerEdit itemData={row} onDone={this.reloadGetTableData} onReload={this.reloadGetTableData}/>,
      });
    },
  },

};
</script>

<style lang="scss" scoped>
.t-r{
  text-align: right;
}
</style>
