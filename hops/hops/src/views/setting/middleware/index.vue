<template>
	<div class="setting-panel">
		<TableList ref="tableMiddle" @handleFunc="handleFunc"></TableList>
		<el-dialog :title="title" :visible.sync="visible" width="650px" center :close-on-click-modal="false" :show-close="false">
			<Edit :formData="formData">
				<template #submit>
					<span slot="footer" class="dialog-footer dialog-submit">
						<el-button @click="visible = false">取 消</el-button>
						<el-button type="primary" @click="submitForm">确 定</el-button>
					</span>
				</template>
			</Edit>
		</el-dialog>
	</div>
</template>
<script>
import { saveMiddle, updateMiddle } from '@/api'
export default {
	name: 'settingBusiness',
	components: {
		TableList: () => import('./components/TableList.vue'),
		Edit: () => import('./components/Edit.vue'),
	},
	data() {
		return {
			visible: false,
			title: '新增业务',
			formData: {},
		}
	},
	methods: {
		submitForm() {
			let params = { ...this.formData }
			if (this.title == '新增业务') {
				saveMiddle(params).then((res) => {
					if (res.status == 1) {
						this.$message({
							type: 'success',
							message: '保存成功!',
						})
						this.visible = false
						this.$refs.tableMiddle.$refs.currentPage = 1
						this.$refs.tableMiddle.getList()
					} else {
						this.$message({
							type: 'error',
							message: res.message,
						})
					}
				})
			} else {
				updateMiddle(params).then((res) => {
					if (res.status == 1) {
						this.$message({
							type: 'success',
							message: '修改成功!',
						})
						this.visible = false
						this.$refs.tableMiddle.getList()
					} else {
						this.$message({
							type: 'warning',
							message: res.message,
						})
					}
				})
			}
		},
		handleFunc(data) {
			switch (data.type) {
				case 'add':
					this.title = '新增业务'
					this.visible = true
					this.formData = {}
					break
				case 'edit':
					this.title = '编辑业务'
					this.visible = true
					this.formData = data.value
				default:
					break
			}
		},
	},
}
</script>
<style scoped lang="scss">
.setting-panel {
	height: 100%;
	padding: 16px;
}
.dialog-submit {
	display: flex;
	justify-content: space-around;
}
</style>