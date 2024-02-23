<template>
  <div class="page-system-settings-user">
    <div class="knowledge-audit">
      <CompModuleHeader title="知识审核">
        <template v-slot:extra>
          <el-switch v-model="enabled" v-auth="'knowledgeReviewConfig:edit'" @change="changeEnabled" />
        </template>
      </CompModuleHeader>
    </div>
    <TableLayout>
      <div class="content-box">
        <FaultTree class="tree" @node-click="handleNodeClick" />
        <div class="main-content">
          <div class="table-box">
            <el-table ref="tableRef" :data="tableData" height="100%">
              <el-table-column type="index" label="序号" width="200" />
              <el-table-column label="故障名称" prop="faultTypeName" />
              <el-table-column label="审核人" prop="reviewUserNames" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <div v-auth="'knowledgeReviewConfig:edit'">
                    <span v-if="row.reviewUserNames" class="operate-btn" @click="onEdit(row, 'edit')">修改</span>
                    <span v-else class="operate-btn" @click="onEdit(row, 'add')">绑定审核人</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </TableLayout>
  </div>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import CompSelectUser from '@/features/system/otherConfig/components/select-user.vue';
import FaultTree from './faultTree.vue';
import {
  getKnowledgeReviewConfigData,
  updateKnowledgeReviewConfigData,
  getFaultTypeListData,
  addKnowledgeReviewConfigData,
  editKnowledgeReviewConfigData,
} from '../api';

export default {
  components: {
    CompModuleHeader,
    FaultTree,
  },
  data() {
    return {
      staffList: [],
      enabled: true,
      searchForm: {
        faultType: '',
        reviewUserIds: '',
      },
      parentFaultType: '',
      tableData: [],
      operateType: 'add',
      loading: false,
    };
  },
  created() {
    this.getListData();
    this.getConfig();
  },
  methods: {
    changeEnabled(val) {
      const loading = this.showLoading();
      updateKnowledgeReviewConfigData({ enabled: val, })
        .then(() => {})
        .finally(() => {
          loading.close();
        });
    },
    getConfig() {
      const loading = this.showLoading();
      getKnowledgeReviewConfigData()
        .then((result) => {
          if (result) {
            this.enabled = result.enabled;
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    getListData() {
      const loading = this.showLoading();
      const params = {
        parentFaultType: this.parentFaultType,
      };
      getFaultTypeListData(params).then((data) => {
        this.tableData = data;
      }).finally(() => {
        loading.close();
      });
    },
    handleNodeClick(row) {
      this.parentFaultType = row.dictValue;
      this.getListData();
    },
    onEdit(data, type) {
      this.operateType = type;
      this.searchForm = {};
      this.searchForm.faultType = data.faultType;
      if (type === 'add') {
        this.staffList = [];
      } else {
        this.searchForm.id = data.id;
        this.staffList = data.reviewUserIds.split(',').map(item => {
          return {
            userId: Number(item),
          };
        });
      }
      this.$drawer({
        component: () => <CompSelectUser title={'选择人员'} onDone={this.selectionUser} selectedUser={this.staffList}/>,
      });
    },
    selectionUser(data) {
      if (data) {
        let params;
        data.forEach(item => {
          this.staffList.push(item.userId);
        });
        if (this.operateType === 'add') {
          params = {
            ...this.searchForm,
            reviewUserIds: this.staffList.join(','),
          };
          addKnowledgeReviewConfigData(params).then(res => {
            this.$message.success('绑定成功');
            this.getListData();
          });
        } else {
          params = {
            ...this.searchForm,
            reviewUserIds: this.staffList.join(','),
          };
          editKnowledgeReviewConfigData(params).then(res => {
            this.$message.success('修改成功');
            this.getListData();
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledge-audit{
  height: 40px;
  width: 100%;
  padding: 16px 24px 0 24px;
}
.page-system-settings-user {
  background-color: #fff;
  height: calc(100vh - 172px);
  display: flex;
  flex-direction: column;
}
.item {
  width: 240px;
  margin-right: 16px;
  margin-bottom: 16px;
}

.content-box {
  height: 100%;
  flex: auto;
  display: flex;
  padding: 10px;
  background: #fff;

  .tree {
    flex: 0 0 260px;
    border-right: 1px solid #dde9e8;
  }

  .main-content {
    padding-left: 10px;
    flex: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .top-box {
      flex: none;
      display: flex;
      justify-content: space-between;

      .search-box {
        flex: auto;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;

        .search-item {
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }

      .operate-box {
        flex: none;
        margin-left: 20px;
      }
    }

    .table-box {
      flex: auto;
      overflow: hidden;
      min-height: 100px;

      .operate-btn {
        margin-right: 16px;
        font-size: 14px;
        color: #006666;
        cursor: pointer;

        &.delete {
          color: #ff836b;
        }
      }
    }
  }
}
</style>
