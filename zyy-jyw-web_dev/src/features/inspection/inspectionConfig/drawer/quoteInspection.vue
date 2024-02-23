<template>
  <drawer-template>
    <template #title> 引用巡检项</template>

    <el-row class="h-100">
      <el-col
        :span="14"
        class="h-100 left-box border"
      >
        <h5 class="title">{{ data.parentType === '1' ? '资产' : '单元' }}及对应巡检项</h5>
        <el-col
          :span="24"
          class="left-box-content h-100"
        >
          <el-col
            :span="10"
            class="h-100 left-box-item"
          >
            <el-input
              v-model="queryData.keyword"
              class="left-box-item-input"
              @input="changeInput"
            />
            <ul class="left-box-item-ul">
              <li
                v-for="(item,index) in assetsList"
                :key="index"
                :class="index === theIndex ? 'actived' : ''"
                @click="onItem(item,index)"
              >
                {{ item.name || item.directoryToName }}
              </li>
            </ul>
            <el-pagination
              :page-size="20"
              :pager-count="5"
              :total="pagination.total"
              background
              class="pagination"
              layout="prev, pager, next"
              small
              @current-change="handleCurrentChange"
            />
          </el-col>
          <el-col
            :span="14"
            class="left-box-table"
          >
            <el-table
              ref="leftTable"
              :data="leftTableData"
              :row-key="getRowKey"
              border
              reserve-selection
              stripe
              @select="leftSelect"
              @selection-change="leftHandleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                label="巡检项名称"
                prop="itemName"
              />
              <el-table-column
                label="巡检项类型"
                prop="itemTypeToName"
              />
            </el-table>
          </el-col>
        </el-col>
      </el-col>
      <el-col
        :span="10"
        class="h-100 border  "
      >
        <el-row style="display: flex;align-items: center;padding-right: 16px">
          <el-col :span="12">
            <h5 class="title">已选巡检项</h5>
          </el-col>
          <el-col
            :span="12"
            class="align-right"
          >
            <pure-button
              :disabled="!selectedRightTableData.length"
              label="清除选中"
              type="minor"
              @click="clearSelected"
            />
          </el-col>
        </el-row>

        <div class="right-box">
          <el-table
            :data="rightTableData"
            border
            stripe
            @select="rightHandleSelectionChange"
            @select-all="rightHandleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              label="巡检项名称"
              prop="itemName"
            />
            <el-table-column
              label="巡检项类型"
              prop="itemTypeToName"
            />
          </el-table>
        </div>

      </el-col>
    </el-row>

    <template #footer>
      <pure-button
        label="确定"
        @click="onSubmit"
      />
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />
    </template>
  </drawer-template>
</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import InspectionApi from '../../api';
import { debounce, isEqual, uniqWith, } from 'lodash-es';
import PureButton from '@/common/components/button/index.vue';
import { Loading, } from 'element-ui';
import { INSPECTION_CONFIG_ASSET_TYPE, } from '@/features/inspection/inspection.config';

export default {
  components: {
    PureButton,
    DrawerTemplate,
  },
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      leftTableData: [],
      rightTableData: [],
      selectedRightTableData: [],
      theIndex: -1,
      assetsList: [],
      pagination: {
        total: 0,
      },
      queryData: {
        keyword: '',
        pageNum: 1,
        pageSize: 20,
      },
    };
  },
  mounted() {
    this.initList();
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.queryData.pageNum = pageNum;
      this.initList();
    },
    changeInput: debounce(function (value) {
      this.queryData.keyword = value;
      this.queryData.pageNum = 1;
      this.initList();
    }, 300),
    // table复选框
    leftHandleSelectionChange(value) {
      this.rightTableData = [
        ...this.rightTableData,
        ...value,
      ];
      this.rightTableData = uniqWith(this.rightTableData, isEqual);
    },
    leftSelect(selection, row) {
      const cancelData = arguments[1];
      if (cancelData) {
        this.rightTableData = this.rightTableData.filter(item => item.id !== cancelData.id);
      }
    },
    rightHandleSelectionChange(val) {
      this.selectedRightTableData = val;
    },

    clearSelected() {
      if (!this.selectedRightTableData.length) {
        this.$notify.warning('请先选择巡检项');
        return;
      }
      if (this.selectedRightTableData.length && this.leftTableData.length) {
        this.selectedRightTableData.forEach(val => {
          const findVal = this.leftTableData.find(item => item.id === val.id);
          if (findVal) {
            this.$refs.leftTable.toggleRowSelection(findVal, false);
          }
        });
      } else {
        this.$refs.leftTable.clearSelection();
      }
      this.rightTableData = this.rightTableData.filter(item => !this.selectedRightTableData.includes(item));
      this.selectedRightTableData = [];
    },
    onItem(item, index) {
      this.theIndex = index;
      this.getInspectionItemData(item);
    },
    getRowKey(row) {
      return row.id;
    },

    // 获取对应巡检项数据
    getInspectionItemData: debounce(async function (data) {
      const query = {
        parentId: data.id,
        parentType: 1,
      };
      const res = await InspectionApi.getCurrentInspectionConfig(query);
      this.leftTableData = res || [];
      this.$nextTick(() => {
        if (this.rightTableData.length && this.leftTableData.length) {
          this.rightTableData.forEach(val => {
            const findVal = this.leftTableData.find(item => item.id === val.id);
            if (findVal) {
              this.$refs.leftTable.toggleRowSelection(findVal, true);
            }
          });
        }
      });
    }, 300),
    cancel() {
      this.$emit('done');
    },
    // 提交
    async onSubmit() {
      const loading = Loading.service({
        lock: true,
        text: '提交中',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      try {
        for (const i of this.rightTableData) {
          const params = {
            ...i,
          };
          params.parentType = this.data.parentType;
          params.parentId = this.data.parentId;
          await InspectionApi.addInspectionConfig(params);
          this.rightTableData = [];
          this.$emit('done');
        }
      } catch (err) {
        this.$notify({
          type: 'error',
          message: err,
        });
      } finally {
        loading.close();
      }
    },
    // 初始化左侧资产或者单元列表
    async initList() {
      let api = null;
      if (this.data.parentType === INSPECTION_CONFIG_ASSET_TYPE) {
        api = InspectionApi.getInspectionConfigAssetList;
      } else {
        api = InspectionApi.getInspectionConfigUnitList;
      }
      const res = await api(this.queryData);
      this.pagination.total = res?.total || 0;
      this.assetsList = res.rows || [];
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.left {
  &-box {
    display: flex;
    flex-direction: column;

    &-content {
      flex: 1;
      overflow: hidden;
    }

    &-table {
      padding: 0 16px;

    }

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 16px;
      border-right: 1px solid #F0F7F7;

      &-ul {
        flex: 1;
        list-style: none;
        overflow: auto;
        margin: 0;

        .actived {
          background: #f0f7f7;
          border-radius: 4px 4px 4px 4px;
          color: #006666;
        }

        li {
          font-size: 14px;
          font-weight: 400;
          color: #282827;
          padding: 6px 16px;
        }
      }
    }
  }
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: #282827;
  margin: 16px;
  padding: 0;
}

.button {
  margin-top: 16px;
  margin-right: 16px;
}

.border {
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #dde9e8;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right {
  &-box {
    padding: 0 16px;
  }
}
</style>
