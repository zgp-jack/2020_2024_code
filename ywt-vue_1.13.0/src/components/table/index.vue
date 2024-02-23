<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-07-07 13:41:51
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-10-13 17:45:10
 * @FilePath: \华西二院\ywt-vue\src\components\table\index.vue
 * @Description:封装表格组件
-->
<template>
  <div v-loading="loading" class="container">
    <el-table
      ref="table"
      v-bind="$attrs"
      :data="tableData"
      :stripe="stripe"
      border
      :height="tableHeight"
      tooltip-effect="dark"
      :row-class-name="getRowClassName"
      :header-row-class-name="getHeaderRowClassName"
      :header-cell-style="getHeaderCellStyle"
      :cell-style="getCellStyle"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectedChange"
    >
      <template v-for="column in columns">
        <!-- 插槽表格 -->
        <slot v-if="column.slot" :name="column.slot" />
        <!-- 类型表格 -->
        <el-table-column
          v-else-if="column.type"
          :key="column.type"
          :selectable="selectable"
          v-bind="column"
          :width="column.width || '45'"
          :align="align"
          :formatter="column.formatter"
        />
        <!-- 下拉表格 -->
        <el-table-column
          v-else-if="column.selects"
          :key="column.value"
          v-bind="column"
          :width="column.width"
          :label="column.label"
          :align="align"
        >
          <template v-slot="{ row }">
            <div v-for="selectItem in column.selects" :key="selectItem.model">
              <el-select
                ref="selects"
                v-model="row[selectItem.model]"
                size="mini"
                :disabled="selectItem.disabled ? selectItem.disabled(row) : false"
                filterable
                @change="selectItem.change($event, row)"
              >
                <el-option
                  v-for="(item, index) in selectItem.options(row)"
                  :key="index"
                  :label="item[selectItem.optionLabel]"
                  :value="item[selectItem.optionValue]"
                />
              </el-select>
            </div>
          </template>
        </el-table-column>
        <!-- 按钮表格 -->
        <template v-else-if="column.buttons">
          <el-table-column
            :key="column.value"
            v-bind="column"
            :label="column.label"
            :align="align"
            :fixed="column.fixed || false"
          >
            <template v-slot="{ row }">
              <span
                v-for="button in column.buttons.filter((button) =>
                  typeof button.hidden === 'function'
                    ? !button.hidden(row)
                    : !button.hidden
                )"
                :key="button.value"
                class="buttons-column"
              >
                <!-- 气泡弹窗口按钮 -->
                <el-popconfirm
                  v-if="button.confirm"
                  :loading="button.loading"
                  :type="button.type"
                  :size="button.size"
                  :icon="
                    typeof button.icon === 'function'
                      ? button.icon(row)
                      : button.icon
                  "
                  :disabled="
                    typeof button.disabled === 'function'
                      ? button.disabled(row)
                      : button.disabled
                  "
                  :title="`确定${button.label}吗？`"
                  @confirm="button.confirm(row)"
                >
                  <el-button
                    slot="reference"
                    type="text"
                    size="mini"
                  >
                    {{
                      typeof button.label === "function"
                        ? button.label(row)
                        : button.label
                    }}
                  </el-button>
                </el-popconfirm>
                <!-- 普通按钮 -->
                <el-button
                  v-if="button.click"
                  :class="
                    typeof button.class === 'function'
                      ? button.class(row)
                      : button.class
                  "
                  :loading="button.loading"
                  :type="button.type"
                  :size="button.size"
                  :icon="
                    typeof button.icon === 'function'
                      ? button.icon(row)
                      : button.icon
                  "
                  :disabled="
                    typeof button.disabled === 'function'
                      ? button.disabled(row)
                      : button.disabled
                  "
                  @click="button.click(row)"
                >
                  {{
                    typeof button.label === "function"
                      ? button.label(row)
                      : button.label
                  }}
                </el-button>
              </span>
            </template>
          </el-table-column>
        </template>
        <!-- 常规表格 -->
        <template v-else>
          <el-table-column
            :key="column.value"
            :selectable="selectable"
            v-bind="column"
            :label="column.label"
            :formatter="column.formatter"
            :show-overflow-tooltip="showTip"
            :align="align"
          >
            <!-- 嵌套表格 -->
            <template v-if="column.children">
              <el-table-column
                v-for="child in column.children"
                :key="child.value"
                :selectable="selectable"
                v-bind="child"
                :label="child.label"
                :formatter="child.formatter"
                :show-overflow-tooltip="showTip"
                :align="align"
                :render-header="renderheader"
              />
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
    <el-pagination
      v-if="pagination"
      style="margin: 10px; text-align: right"
      :page-sizes="pageSizes"
      :page-size="pagination.pageSize"
      :page-count="pageCount"
      :current-page="pagination.page"
      :total="total"
      :layout="layout"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Table',
  inheritAttrs: false,
  props: {
    align: {
      type: String,
      default: 'left',
    },
    tableHeight: {
      type: String,
      default: 'auto',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Array,
      required: true,
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    editSelectedRow: {
      type: Object,
      default: () => ({}),
    },
    columns: {
      type: Array,
      required: true,
    },
    showTip: {
      type: Boolean,
      default: true,
    },
    select: {
      type: Function,
      default: () => {},
    },
    selectAll: {
      type: Function,
      default: () => {},
    },
    selectedChange: {
      type: Function,
      default: () => {},
    },
    selectable: {
      type: Function,
      default: () => {
        return true;
      },
    },
    singleSelect: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default: null,
    },
    pageCount: {
      type: Number,
      default: 5,
    },
    total: {
      type: Number,
      default: 0,
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    pageSizes: {
      type: Array,
      default: () => [20, 30, 40],
    },
    currentChange: {
      type: Function,
      default: () => {},
    },
    sizeChange: {
      type: Function,
      default: () => {},
    },
    setCellStyleAttrs: {
      type: Object,
      default: () => {},
    },
    // 定制化表头
    renderheader: {
      type: Function,
      default: () => {},
    },
    // 扩展：对指定表格的样式定制化
    customCellStyle: {
      type: Object,
      default: () => {
        return {
          propertys: [],
          style: '',
        };
      },
    },
  },
  data() {
    return {};
  },
  watch: {
    editSelectedRow() {
      this.defaultEditSelectRow();
    },
  },
  mounted() {},
  methods: {
    getRowClassName({ row, rowIndex, }) {
      return '';
    },
    getHeaderRowClassName({ row, rowIndex, }) {
      return '';
    },
    getHeaderCellStyle({ row, column, rowIndex, columnIndex, }) {
      if (rowIndex === 0) {
        return '';
      } else {
        return '';
      }
    },
    getCellStyle({ row, column, rowIndex, columnIndex, }) {
      const { propertys, style, } = this.customCellStyle;
      if (propertys.includes(column.property)) {
        return `padding:20px 0px;${style}`;
      } else {
        return 'padding:20px 0px;';
      }
    },
    defaultEditSelectRow() {
      if (this.editSelectedRow) {
        const { editKey, editVal, } = this.editSelectedRow;
        for (let i = 0; i < this.tableData.length; i++) {
          const row = this.tableData[i];
          if (row[editKey] === editVal) {
            // 设置默认选中行
            this.$nextTick(() => {
              this.$refs.table.toggleRowSelection(row, true);
            });
          }
        }
      }
    },
    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected);
    },
    singleChoose(rows) {
      this.$refs.table.clearSelection();
      this.$refs.table.toggleRowSelection(rows.pop());
    },
  },
};
</script>
<style>
/* .el-table th > .cell {
  word-break: keep-all;
} */
</style>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  // ::v-deep .el-table td.el-table__cell div{
  //   display: flex;
  //   justify-content: center;
  //   .buttons-column{
  //     padding: 0 10px;
  //   }
  // }
  .buttons-column{
    padding: 0 5px;
  }
}

</style>
