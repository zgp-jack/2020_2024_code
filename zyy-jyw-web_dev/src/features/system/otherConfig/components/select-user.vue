<template>
  <drawer-template>
    <template #title>
      {{ title }}
    </template>
    <!-- <query-panel @query="onSearch" @reset="onReset">
      <el-form-item>
        <el-input v-model="queryData.userName" placeholder="请输入用户名称" prefix-icon="el-icon-search" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.phonenumber" v-number placeholder="请输入手机号码" prefix-icon="el-icon-search" />
      </el-form-item>
    </query-panel> -->

    <pure-table ref="pureTable" :show-pagination="false" :default-selected="selectedUser" :default-selected-key="'userId'" :query-condition="queryData" :list-api="listApi" selection @selection-change="changeSelection">
      <el-table-column label="用户名称" prop="userName" />
      <el-table-column label="用户昵称" prop="nickName" />
      <!-- <el-table-column label="科室" prop="dept" :formatter="formatDept" /> -->
      <!-- <el-table-column label="组长" prop="isLeader" :formatter="formatIsLeader" /> -->
    </pure-table>
    <template #footer>
      <pure-button @click="onConfirm">
        确定
      </pure-button>
      <pure-button type="patch" @click="onCancel">
        取消
      </pure-button>
    </template>
  </drawer-template>

</template>

<script>
import SystemUserApi from '@/features/system/user/api';
import DrawerTemplate from '@/common/components/drawer/template.vue';
// import QueryPanel from '@/common/components/query/queryPanel.vue';
export default {
  components: {
    DrawerTemplate,
    // QueryPanel,
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    selectedUser: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      listApi: SystemUserApi.getUserAllList,
      queryData: {
        userName: '',
        phonenumber: '',
      },
      selectionData: [],

    };
  },
  watch: {
    // tableData() {
    //   this.toggleSelection(this.selectedUser);
    // },
  },
  mounted() {
    // this.getListData();
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    changeSelection(selection) {
      this.selectionData = selection;
    },
    formatDept(row, col, val) {
      return val?.deptName ?? '-';
    },
    formatIsLeader(row, col, val) {
      return val === 1 ? '是' : '否';
    },

    onSearch() {
      this.init();
    },
    onConfirm() {
      if (!this.selectionData.length) {
        this.$notify.error('请至少选中一个用户');
        return;
      }
      this.$emit('done', this.selectionData);
    },
    onCancel() {
      this.$emit('done');
    },
    onReset() {
      this.queryData = {
        userName: '',
        phonenumber: '',
      };
      this.onSearch();
    },

  },
};
</script>
