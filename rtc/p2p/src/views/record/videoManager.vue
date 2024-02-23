<template>
	<el-container class="page-container">
		<div class="table-panel">
			<el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline" slot="left">
				<el-form-item label="开始时间：">
					<el-date-picker
						v-model="formInline.beginTime"
						popper-class="begin-now"
						type="datetime"
						:clearable="true"
						placeholder="选择开始时间"
						:picker-options="pickerOptions1"
						value-format="yyyy-MM-dd HH:mm:ss"
						:editable="false"
						default-time="00:00:00"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间：">
					<el-date-picker
						v-model="formInline.endTime"
						:clearable="true"
						type="datetime"
						placeholder="选择结束时间"
						:picker-options="pickerOptions2"
						value-format="yyyy-MM-dd HH:mm:ss"
						:editable="false"
						default-time="00:00:00"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getList">查询</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" stripe style="width: 100%" height="calc(100% - 80px)">
				<el-table-column label="序号" type="index" width="180"> </el-table-column>
				<el-table-column prop="username" label="发起者" width="180"> </el-table-column>
				<el-table-column prop="startTime" label="开始时间" width="180"> </el-table-column>
				<el-table-column prop="endTime" label="结束时间" width="180"> </el-table-column>
				<el-table-column prop="typeName" label="类型" width="180"></el-table-column>
				<el-table-column prop="groupName" label="群名称" width="180"></el-table-column>
				<!-- <el-table-column prop="loginDevice" label="参与者"> </el-table-column> -->
				<el-table-column prop="fileName" label="录像路径"> </el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="handleEdit(scope.row)" type="text" size="small">查看</el-button>
						<!-- <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button> -->
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="" :visible.sync="dialogVisible" width="60%" center>
			<video v-if="dialogVisible" :src="objUrl" class="videoC" controls autoplay style="text-align: left">
				Your browser is too old which doesn't support HTML5 video.
			</video>
		</el-dialog>
	</el-container>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
export default {
	name: 'videoManager',
	data() {
		return {
			formInline: { beginTime: '', endTime: '' },
			tableData: [],
			dialogVisible: false,
			formData: {
				id: '',
				username: '',
				password: '',
			},
			rules: {},
			submitType: 'add',
			objUrl: '/debug/video/videoRecord/2_camera.webm',
		};
	},
	computed: {
		pickerOptions1() {
			let st = '';
			if (this.formInline.endTime && this.formInline.beginTime) {
				let startDate = dayjs(this.formInline.beginTime).format('YYYY-MM-DD HH:mm:ss').split(' ');
				let endDate = dayjs(this.formInline.endTime).format('YYYY-MM-DD HH:mm:ss').split(' ');
				if (startDate[0] == endDate[0]) {
					st = endDate[1];
					if (this.formInline.beginTime >= this.formInline.endTime) {
						this.formInline.beginTime = this.formInline.endTime;
					}
				} else {
					st = '23:59:59';
				}
			} else {
				let startDate = dayjs(this.formInline.beginTime).format('YYYY-MM-DD HH:mm:ss').split(' ');
				let nowDate = dayjs().format('YYYY-MM-DD HH:mm:ss').split(' ');
				if (startDate[0] == nowDate[0]) {
					st = nowDate[1];
				} else {
					st = '23:59:59';
				}
			}
			return {
				disabledDate: (time) => {
					let timeOptionRange = this.formInline.endTime;
					let now = Date.now();
					if (timeOptionRange) {
						return time.getTime() > new Date(timeOptionRange).getTime() || time.getTime() > now;
					}
					return time.getTime() > now;
				},
				selectableRange: '00:00:00 - ' + st,
			};
		},
		pickerOptions2() {
			let nowDate = dayjs().format('YYYY-MM-DD HH:mm:ss').split(' ');
			let nt = nowDate[1];
			let et = '00:00:00';
			if (this.formInline.endTime && this.formInline.beginTime) {
				let startDate = dayjs(this.formInline.beginTime).format('YYYY-MM-DD HH:mm:ss').split(' ');
				let endDate = dayjs(this.formInline.endTime).format('YYYY-MM-DD HH:mm:ss').split(' ');
				if (startDate[0] == endDate[0]) {
					et = startDate[1];
				} else {
					et = '00:00:00';
				}
				if (endDate[0] != nowDate[0]) {
					nt = '23:59:59';
				}
			} else {
				let endDate = dayjs(this.formInline.endTime).format('YYYY-MM-DD HH:mm:ss').split(' ');
				if (endDate[0] == nowDate[0]) {
					nt = nowDate[1];
				} else {
					nt = '23:59:59';
				}
			}
			return {
				disabledDate: (time) => {
					let timeOptionRange = this.formInline.beginTime;
					let now = Date.now();
					if (timeOptionRange) {
						return time.getTime() < new Date(timeOptionRange).getTime() - 24 * 60 * 60 * 1000 || time.getTime() > now;
					}
					return time.getTime() > now;
				},
				// selectableRange: et + ' - ' + nt
			};
		},
	},
	mounted() {
		this.getList();
	},
	methods: {
		getList() {
			this.$axios({
				method: 'get',
				url: '/api/video/record/fileList',
				params: { page: 1, pageSize: 9999, ...this.formInline },
			}).then((res) => {
				const data = res.data.data;
				if (data.status == 1) {
					this.tableData = data.data.list;
				}
			});
		},
		handleAdd() {
			this.formData = {
				username: '',
				password: '',
			};
			this.dialogVisible = true;
			this.submitType = 'add';
		},
		handleEdit(item) {
			this.dialogVisible = true;
			this.objUrl = '/debug/video/' + item.path + item.fileName;
		},
		handleDelete(item) {
			this.$confirm('确认删除该用户?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				axios.delete('/api/user/del', { data: { id: item.id } }).then((res) => {
					const data = res.data;
					if (data.status === 1) {
						this.getList();
						this.$message({
							type: 'success',
							message: '删除成功!',
						});
					}
				});
			});
		},
		submitForm() {
			const url = this.submitType === 'add' ? '/api/user/save' : '/api/user/update';
			const method = this.submitType === 'add' ? 'post' : 'put';
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					axios[method](url, this.formData).then((res) => {
						const data = res.data;
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
.videoC {
	width: 100%;
}
</style>