<template>
    <el-table
        :data="tableData"
        style="width: 100%"
        current-change
        ref="indexTable"
        highlight-current-row
        class="index-table"
        height="100%"
    >
        <el-table-column
            v-for="item in tableHeader"
            align="center"
            :type="item.type || undefined"
            :width="item.width"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable"
            :sort-by="item.sortBy"
            show-overflow-tooltip
        >
        </el-table-column>
    </el-table>
</template>
<script>
export default {
	name: 'indexTable',
	data() {
		return {
		}
	},
	props: ['tableHeader', 'tableData'],
}
</script>
<style lang="scss">
.index-table .el-table__header tr{
    height: 26px;
    border-radius: 4px;
    opacity: 1;
    background: #dde9e8;
    box-shadow: 0 0 0 4px #dde9e8;
    outline: 1px #fff solid;
}
.index-table th.el-table__cell.is-leaf {
    padding: 0;
    background-color: transparent !important;
    
}
.index-table td.el-table__cell,.index-table th.el-table__cell.is-leaf {
    border: 0;
}
.index-table,.index-table tr {
    background-color: transparent;
}
.index-table .el-table__cell span{
    font-size: 11px;
     color: #888;
}
.index-table .cell, .index-table th.el-table__cell>.cell {
    padding-left: 2px;
    padding-right: 2px;
}
</style>