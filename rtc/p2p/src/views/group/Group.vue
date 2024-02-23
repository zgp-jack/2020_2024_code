<template>
	<el-container class="page-container" style="flex-direction: column">
		<div class="table-panel">
			<el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline" slot="left">
				<el-form-item label="群指名称">
					<el-input v-model="formInline.name" placeholder="群指名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getList">查询</el-button>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" stripe style="width: 100%" height="calc(100% - 80px)">
				<el-table-column prop="id" label="序号"> </el-table-column>
				<el-table-column prop="name" label="群指名称"> </el-table-column>
				<el-table-column prop="userList" label="群指成员"> </el-table-column>
				<el-table-column prop="deviceIds" label="群指设备"> </el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!-- <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button> -->
						<el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" center>
			<el-form
				:model="formData"
				status-icon
				:rules="rules"
				ref="ruleForm"
				label-position="left"
				label-width="100px"
				class="form-user"
			>
				<el-form-item label="群指名称" prop="name">
					<el-input type="text" v-model="formData.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="群指成员" prop="userIds">
					<el-select v-model="formData.userIds" placeholder="请选择" multiple filterable>
						<el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value">
							<i
								:class="[
									{ 'el-icon-user': item.type === 1 },
									{ 'el-icon-video-camera': item.type === 2 },
									{ 'el-icon-coordinate': item.type === 3 },
									{ 'el-icon-map-location': item.type === 4 },
								]"
								:size="20"
							></i>
							<span>{{ item.label }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="群指设备" prop="deviceIds">
					<el-select v-model="formData.deviceIds" placeholder="请选择" multiple>
						<el-option v-for="item in deviceList" :key="item.deviceId" :label="item.name" :value="item.deviceId">
						</el-option>
					</el-select>
				</el-form-item> -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm()">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
import axios from 'axios';
export default {
	data() {
		return {
			formInline: { name: '' },
			tableData: [],
			dialogVisible: false,
			formData: {
				id: '',
				name: '',
				userId: '',
				userIds: [],
			},
			rules: {},
			userList: [],
			deviceList: [],
			user: JSON.parse(sessionStorage.getItem('user')),
			submitType: 'add',
		};
	},
	mounted() {
		this.getUserList();
		this.getList();
	},
	methods: {
		getUserList() {
			this.$axios.get('/api/user/query').then((res) => {
				const data = res.data.data;
				if (data.status === 1) {
					this.userList = data.data.map((item) => {
						return {
							label: item.username,
							value: item.id,
							type: item.type
						};
					});
				}
			});
		},
		getList() {
			this.$axios({
				method: 'get',
				url: '/api/group/getGroupList',
				params: { userId: this.user.id, groupName: this.formInline.name },
			}).then((res) => {
				const data = res.data.data;
				if (data.status === 1) {
					this.tableData = data.data.map((item) => {
						return {
							id: item.id,
							name: item.name,
							userId: item.userList.map((u) => u.userId),
							userList: item.userList.filter(item => item.type === 1).map((u) => u.userName).join(','),
							deviceIds: item.userList.filter(item => item.type !== 1 && item.type !== 4).map((u) => u.userName).join(','),
						};
					});
				}
			});
		},
		handleAdd() {
			this.formData = {
				name: '',
				// userId: this.user.id,
				userIds: [],
			};
			this.dialogVisible = true;
			this.submitType = 'add';
		},
		handleEdit(item) {
			this.formData['id'] = item.id;
			this.formData.name = item.name;
			this.formData.userIds = item.userIds;
			this.dialogVisible = true;
		},
		handleDelete(item) {
			this.$confirm('确认删除该群指?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.$axios({
						method: 'get',
						url: '/api/group/del',
						params: { id: item.id },
					})
						// axios.delete('/api/group/del', { data: { id: item.id } })
						.then((res) => {
							const data = res.data.data;
							if (data.status === 1) {
								this.getList();
								this.$message({
									type: 'success',
									message: '删除成功!',
								});
							}
						});
				})
				.catch(() => {});
		},
		submitForm() {
			const url = this.submitType === 'add' ? '/api/group/create' : '/api/group/create';
			// const method = this.submitType === 'add' ? 'post' : 'put';
			const method = 'get';
			this.formData.userIds = this.formData.userIds.join();
			this.formData.deviceIds = '';
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					this.$axios({
						method: 'get',
						url: url,
						params: this.formData,
					})
						// axios[method](url, this.formData)
						.then((res) => {
							const data = res.data.data;
							if (data.status === 1) {
								this.dialogVisible = false;
								this.getList();
							}
						});
				}
			});
		},
	},
};
</script>
<style scoped>
.demo-form-inline{
	padding: 0 10px;
}
</style>