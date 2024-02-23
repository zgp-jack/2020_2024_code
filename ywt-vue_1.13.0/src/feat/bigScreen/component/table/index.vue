<template>
  <el-table
    ref="table"
    class="bigScreenTable"
    :data="data"
    style="width: 100% !important; background:transparent"
    height="100%"
    size="small"
    :row-style="rowStyle"
    :header-row-style="headerRowStyle"
    :header-cell-style="headerCellStyle"
    :cell-style="cellStyle"
    v-bind="$attrs"
    @mouseenter.native="mouseEnter"
    @mouseleave.native="mouseLeave"
    @row-click="rowClick"
  >
    <slot />
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isRoll: {
      type: Boolean,
      default: true,
    },
    columnConfig: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      rollTimer: null,
      refreshTime: 5,
      rollTime: 5,
      rollPx: 1,
    };
  },
  computed: {

  },
  mounted() {
    this.autoRoll();
  },
  methods: {
    autoRoll(stop) {
      //  禁用滚动
      if (!this.isRoll) {
        return;
      }
      if (stop) {
        clearInterval(this.rollTimer);
        return;
      }
      const table = this.$refs.table;
      const divData = table.bodyWrapper;
      this.rollTimer = setInterval(() => {
        divData.scrollTop += this.rollPx;
        if (divData.clientHeight + divData.scrollTop === divData.scrollHeight) {
          divData.scrollTop = 0;
        }
      }, this.rollTime * 10);
    },
    mouseEnter(time) {
      this.autoRoll(true);
    },
    mouseLeave() {
      this.autoRoll();
    },
    rowClick(row, column, event) {
      this.$emit('rowClick', row, column, event);
    },
    rowStyle({ row, index, }) {
      return {
        background: 'transparent',
      };
    },
    cellStyle() {
      return {
        fontSize: ' 14px',
        fontWeight: ' 400',
        color: '#c9e5ff',
        borderBottom: '1px dashed rgba(201,229,255,0.3)',

      };
    },
    headerCellStyle() {
      return {
        background: 'transparent',
        color: '#1890FF',
        fontSize: '14px',
        fontWeight: 400,
        borderBottom: '1px  solid #1890ff',
      };
    },
    headerRowStyle() {
      return {
        background: 'transparent',
      };
    },
  },
};
</script>

<style   lang="scss" scoped>
.bigScreenTable{
  &::before{
  background-color: transparent;
  }

}
</style>
