<template>
	<div class="setting-panel">
		<TableList ref="table" @handleFunc="handleFunc"></TableList>
		<el-dialog :title="title" :visible.sync="visible" width="650px">
			<Edit :type="editType" :detailData="detailData" @handleSubmit="handleSubmit" @handleClose="handleClose"></Edit>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'settingHost',
	components: {
		TableList: () => import('./components/TableList.vue'),
		Edit: () => import('./components/Edit.vue'),
	},
	data() {
		return {
			visible: false,
			title: '新增主机',
			editType: 'edit',
			detailData: {},
		}
	},
	mounted() {},
	methods: {
		handleFunc(data) {
			switch (data.type) {
				case 'add':
					this.title = '新增主机'
					this.editType = 'add'
					this.visible = true
					this.detailData = {}
					break
				case 'edit':
					this.title = '编辑主机'
					this.editType = 'edit'
					this.visible = true
					this.detailData = data.value
				default:
					break
			}
		},
		handleClose() {
			this.visible = false
		},
		handleSubmit() {
			this.$refs['table'].getList()
			this.handleClose()
		},
	},
}
</script>
<style scoped lang="scss">
.setting-panel {
	padding: 16px;
	height: 100%;
}
</style>