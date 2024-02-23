<template>
  <el-container>
    <el-header height="">
      <!-- Header content -->
    </el-header>
    <el-container>
      <el-header height="150">
        <collapse>
          <collapse-item>
            <template #title>
              人员信息
            </template>
            <el-descriptions :column="2" :label-style="{color:'#7D8DB3'}">
              <el-descriptions-item label="姓名">
                {{ itemData.name || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="电话">
                {{ itemData.mblNo || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="用户名">
                {{ itemData.userName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="科室">
                {{ itemData.deptName || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </collapse-item>
        </collapse>
      </el-header>
      <el-main>
        <el-table :data="tableData" border class="m-t-16">
          <el-table-column prop="name" label="去向" width="200px" />
          <el-table-column prop="startTime" label="开始时间" width="200px">
            <template #default="{row}">
              {{ row.startTime |toDate }}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="200px">
            <template #default="{row}">
              {{ row.endTime |toDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button type="text" @click="onDel(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- Main content -->
      </el-main>
    </el-container>

    <el-footer class="footer">
      <el-button type="primary" size="small" @click="onAdd">添加去向</el-button>

    </el-footer>
  </el-container>
</template>

<script>
import WhereAboutsApi from '../api';
import moment from 'moment';
import dialogWidth from '@/views/project/common/width/dialog';
import DialogAddUserWhereAbouts from '../dialog/addUserWhereAbouts.vue';
export default {
  filters: {
    toDate: function (value) {
      if (!value) {
        return '-';
      }
      return moment(value).format('YYYY-MM-DD');
    },
  },
  props: {
    itemData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async onDel(row) {
      await WhereAboutsApi.deleteUserWhereAbouts(row.id);
      this.$emit('reload');
      this.init();
    },
    async init() {
      console.log(this.itemData);

      this.tableData = await WhereAboutsApi.getUserWhereAbouts(
        this.itemData.userId
      );
    },
    onDone() {
      this.init();
      this.$emit('reload');
    },
    onAdd() {
      this.$dialog({
        title: '添加去向',
        width: dialogWidth.small_px,
        component: () => <DialogAddUserWhereAbouts itemData={this.itemData} onDone={this.onDone} />,

      });
    },
  },
};
</script>

<style lang="scss" scoped>
.m-t-16{
  margin-top: 16px;
}
.footer{
  padding: 16px 0 !important;
}
</style>
