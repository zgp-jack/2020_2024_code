<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-27 14:19:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-04 11:11:10
 * @Description:
-->
<template>

  <div>
    <el-popover
      v-model="popoverVisible"
      placement="bottom-start"
      trigger="click"
      @keydown.native="handleSuggestionKeyDown($event)"
    >
      <el-table
        ref="table"
        v-loading="loading"
        :data="data"
        border
        :highlight-current-row="true"
        max-height="400px"
        height="400px"

        @row-click="handleRowClick"
      >
        <el-table-column
          v-for="(item,index) in tableHeader"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="true"
          align="left"
          width="140px"
          @keydown.native="handleSuggestionKeyDown($event)"
          @row-click="handleRowClick"
        >
          <template slot-scope="{row}">
            <span v-if="item.prop === 'price'">
              {{ row.price + '元' }}
            </span>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="pageSizes"
        :current-page="currentPage"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <span slot="reference"><span /></span></el-popover>
    <el-input ref="input" v-model="searchText" size="mini" @blur="handleBlur" @keydown.native="handleSuggestionKeyDown($event)" />
  </div>
</template>

<script>
import PaginationTable from '@/minxins/common/paginationTable';
import PropertyApi from '@/apis/property/propertyManagement/index';
import ConsumableApi from '@/apis/property/consumable';
import AriaUtils from 'element-ui/src/utils/aria-utils';
const { keys: KeyCode, } = AriaUtils;

export default {
  mixins: [PaginationTable],
  props: {
    deptId: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      default: 'Property',
    },
    value: {
      type: String,
      default: null,
    },
    // 已选择的资产，需要进行过滤
    filterIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      popoverVisible: false,
      searchText: null,
      lockPopover: false,
      prevFocusNode: null,
      currentRowIndex: -1,
    };
  },

  computed: {
    api() {
      let api = null;
      switch (this.type) {
        case 'Property':
          api = PropertyApi;
          break;
        case 'Consumable':
          api = ConsumableApi;
          break;
      }
      return api;
    },
    filterId() {
      return this.filterIds.join(',') || null;
    },
    tableHeader() {
      let header = [];
      switch (this.type) {
        case 'Property':
          header = [{
            label: '资产名称',
            prop: 'name',
          }, {
            label: '资产编号',
            prop: 'assetsCode',
          }, {
            label: '规格型号',
            prop: 'model',
          }, {
            label: '资产类型',
            prop: 'assetsTypeToName',
          }, {
            label: '当前科室',
            prop: 'useDeptToName',
          }, {
            label: '制作商',
            prop: 'manufacturerToName',
          }, {
            label: '供应商',
            prop: 'supplierToName',
          }, {
            label: '设备状态',
            prop: 'equipmentStateToName',
          }];
          break;
        case 'Consumable':
          header = [{
            label: '耗材名称',
            prop: 'name',
          }, {
            label: '规格型号',
            prop: 'model',
          }, {
            label: '单位',
            prop: 'unit',
          }, {
            label: '单价',
            prop: 'price',
          }, {
            label: '供应商',
            prop: 'supplier',
          }];
          break;
      }
      return header;
    },
  },
  async created() {
    this.searchText = this.value;
  },
  methods: {
    handleSuggestionKeyDown(event) {
      const { keyCode, } = event;
      switch (keyCode) {
        case KeyCode.enter:
          this.popoverVisible = true;
          this.lockPopover = true;
          this.queryCondition.query = this.searchText;

          this.$emit('refresh');
          this.fetchData();
          break;
        case KeyCode.down:
          this.$refs.table.setCurrentRow(this.data[this.currentRowIndex]);
          this.$refs.input.blur();
          addEventListener('keydown', this.handleSelectKeyUp);
          break;
      }
    },
    handleSelectKeyUp(event) {
      const { keyCode, } = event;
      switch (keyCode) {
        case KeyCode.enter:
          this.handleRowClick(this.data[this.currentRowIndex]);
          break;
        case KeyCode.down:
          this.currentRowIndex = this.getNextIndex();
          this.$refs.table.setCurrentRow(this.data[this.currentRowIndex]);
          break;
        case KeyCode.up:
          this.currentRowIndex = this.getPreIndex();
          this.$refs.table.setCurrentRow(this.data[this.currentRowIndex]);
          break;
      }
    },
    getPreIndex() {
      const len = this.data.length;
      if (len === 0 || len === 1) {
        return 0;
      }
      if (this.currentRowIndex === 0) {
        return len - 1;
      } else {
        return this.currentRowIndex - 1;
      }
    },
    getNextIndex() {
      const len = this.data.length;
      if (this.data.length === 0) {
        return -1;
      }
      if (this.currentRowIndex === (len - 1)) {
        return 0;
      } else {
        return this.currentRowIndex + 1;
      }
    },
    handleBlur() {
      if (!this.lockPopover) {
        this.clearPopover();
      }
    },
    clearPopover() {
      this.popoverVisible = false;
      removeEventListener('keydown', this.handleSelectKeyUp);
    },
    handleRowClick(row) {
      this.searchText = row.name;
      this.$emit('selected', row);
      this.clearPopover();
    },
    async fetchData() {
      this.loading = true;
      this.data = [];
      const { list, total, } = await this.api.list({ ...this.queryCondition, filterId: this.filterId, pageSize: this.pageSize, pageNum: this.currentPage, deptId: this.deptId, isShowReview: 0, });
      this.total = total;
      this.data = list;
      this.loading = false;
      this.currentRowIndex = -1;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
