<template>
	<el-container class="page-container" style="flex-direction: column">
		<div class="table-panel">
			<el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline" slot="left">
				<el-form-item label="用户名">
					<el-input v-model="formInline.username" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getList">查询</el-button>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" stripe style="width: 100%;" height="calc(100% - 80px)">
				<el-table-column prop="id" label="序号" width="180"> </el-table-column>
				<el-table-column prop="username" label="姓名" width="180"> </el-table-column>
				<el-table-column prop="status" label="状态" width="180"> </el-table-column>
				<el-table-column prop="createTime" label="创建时间"> </el-table-column>
				<el-table-column prop="updateTime" label="上次更新时间"> </el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
						<el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="终端" v-if="dialogVisible" :visible.sync="dialogVisible" width="30%" center>
			<el-form
				:model="formData"
				status-icon
				:rules="rules"
				ref="ruleForm"
				label-position="left"
				label-width="100px"
				class="form-user"
			>
				<el-form-item label="用户名" prop="username">
					<el-input
						type="text"
						placeholder="请输入用户名"
						v-model="formData.username"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" placeholder="请输入密码">
					<el-input type="password" v-model="formData.password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="formData.type" placeholder="请选择">
						<el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
				<template v-if="formData.type === 3">
					<el-form-item label="设备IP" prop="deviceIp">
						<el-input type="text" placeholder="请输入设备IP" v-model="formData.deviceIp" autocomplete="off" ></el-input>
					</el-form-item>
					<el-form-item label="设备端口" prop="devicePort">
						<el-input type="text" placeholder='请输入设备端口' v-model="formData.devicePort" autocomplete="off" ></el-input>
					</el-form-item>
					<el-form-item label="用户名" prop="deviceUser">
						<el-input type="text" placeholder='请输入设备登陆用户名' v-model="formData.deviceUser" autocomplete="off" ></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="devicePassword">
						<el-input type="text" placeholder='请输入设备登陆密码' v-model="formData.devicePassword" autocomplete="off" ></el-input>
					</el-form-item>
				</template>
				<template v-if="formData.type === 2">
					<el-form-item label="设备ID" prop="deviceId">
						<el-input type="text" placeholder="请输入设备ID" v-model="formData.deviceId" autocomplete="off" ></el-input>
					</el-form-item>
					<el-form-item label="通道ID" prop="channelsId">
						<el-input type="textarea" placeholder='请输入通道ID,以","号隔开' v-model="formData.channelsId" autocomplete="off" ></el-input>
					</el-form-item>
				</template>
				<el-form-item label="权限" prop="authIds">
					<el-select v-model="formData.authIds" multiple collapse-tags placeholder="请选择">
						<el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm()">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
export default {
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (this.formData.password !== '') {
					// this.$refs.ruleForm.validateField('password');
				}
				callback();
			}
		};
		return {
			formInline: { username: '' },
			tableData: [],
			dialogVisible: false,
			formData: {
				username: '',
				password: '',
				authIds: '',
				accessType: 1,
				deviceId: '',
				channelsId: '',
				deviceIp: '',
				devicePort: '',
				deviceUser: '',
				devicePassword: ''
			},
			rules: {
				password: [{ validator: validatePass, trigger: 'blur' }],
			},
			roleList: [],
			typeList: [
				{id: 1, name: '手持机'},
				{id: 2, name: '布控球-gb28181'},
				{id: 3, name: '布控球-sdk'},
				{id: 4, name: '无人机'},
				{id: 5, name: '地图'},
			],
			submitType: 'add',
		};
	},
	mounted() {
		this.getList();
		this.getAuth();
	},
	methods: {
		getList() {
			this.$axios({
				method: 'get',
				url: '/api/user/query',
				params: { username: this.formInline.username },
			}).then((res) => {
				const data = res.data.data;
				if (data.status === 1) {
					this.tableData = data.data;
				}
			});
		},
		getAuth() {
			this.$axios({
				method: 'get',
				url: '/api/auths/list',
			}).then((res) => {
				const data = res.data.data;
				if (data.status === 1) {
					this.roleList = data.data;
				}
			});
		},
		handleAdd() {
			this.formData = {
				username: '',
				password: '',
				deviceId: '',
				channelsId: ''
			};
			this.dialogVisible = true;
			this.submitType = 'add';
		},
		handleEdit(item) {
			this.formData['id'] = item.id;
			this.formData.username = item.username;
			// this.formData.oldPassword = crypto.createHash('md5').update(item.password, 'utf8').digest('hex');
			this.formData.password = '';
			this.formData.type = item.type;
			this.formData.deviceId = item.deviceId;
			this.formData.channelsId = item.channelsId;
			this.formData.deviceIp = item.deviceIp;
			this.formData.devicePort = item.devicePort;
			this.formData.deviceUser = item.deviceUser;
			this.formData.devicePassword = item.devicePassword;
			this.dialogVisible = true;
			this.submitType = 'edit';
		},
		handleDelete(item) {
			this.$confirm('确认删除该用户?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.$axios({
						method: 'get',
						url: '/api/user/delete',
						params: { id: item.id },
					}).then((res) => {
						const data = res.data.data;
						if (res.data.code === 0) {
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
			const url = this.submitType === 'add' ? '/api/user/add' : '/api/user/update';
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					this.$axios({
						method: 'get',
						url: url,
						params: { ...this.formData, authIds: this.formData.authIds.join(), roleId: 1 },
					}).then((res) => {
						const data = res.data.data;
						decodeURI;
						if (res.data.code === 0) {
							this.$message({
								type: 'success',
								message: this.submitType === 'add' ? '新增成功！' : '修改成功！',
							});
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