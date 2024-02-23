<template>
	<el-dialog :title="dialogTitle" :width="dialogWidth" :visible.sync="visible">
		<el-table :data="tableData" :height="tableHeight">
			<el-table-column v-for="item in tableHeader" :key="item.prop" :prop="item.prop" :label="item.label"> </el-table-column>
		</el-table>
	</el-dialog>
</template>
<script>
export default {
	name: 'modalBox',
	props: ['dialogVisible', 'tableHeader', 'tableData', 'tableHeight', 'dialogWidth', 'dialogTitle'],
	data() {
		return {
			visible: this.dialogVisible,
		}
	},
}
</script>