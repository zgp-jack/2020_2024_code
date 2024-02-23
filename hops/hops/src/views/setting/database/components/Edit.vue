<template>
	<div>
		<el-form :model="formData" :rules="rules" ref="formAddEdit">
			<el-form-item label="名称" prop="name" :label-width="formLabelWidth">
				<el-input v-model="formData.name" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="地址" prop="url" :label-width="formLabelWidth">
				<el-input v-model="formData.url" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="认证ID" prop="authId" :label-width="formLabelWidth">
				<el-input v-model="formData.authId" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="userName" :label-width="formLabelWidth">
				<el-input v-model="formData.userName" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" :label-width="formLabelWidth">
				<el-input type="password" placeholder="请输入密码" v-model="formData.password" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type" :label-width="formLabelWidth">
				<el-select v-model="formData.type" placeholder="请选择类型">
					<el-option v-for="item of typeList" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="维护人员" :label-width="formLabelWidth">
				<el-cascader v-model="orderUserList" :options="orderUser" :show-all-levels="false" filterable style="width: 100%"></el-cascader>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="closeDialog">取 消</el-button>
			<el-button type="primary" @click="submitForm">确 定</el-button>
		</div>
	</div>
</template>
<script>
import ApiDatabase from '@/api/database'
import { mapState } from 'vuex'
export default {
	props: {
		type: {
			type: String,
			default: 'edit',
		},
		detailData: {
			type: Object,
			default: () => {
				return {
					id: null,
					name: '',
					url: '',
					type: 8,
					authId: '',
					userName: '',
					password: '',
					sendUser: null,
				}
			},
		},
	},
	data() {
		return {
			formData: {
				id: null,
				name: '',
				url: '',
				type: 8,
				authId: '',
				userName: '',
				password: '',
				sendUser: null,
			},
			typeList: [
				{ value: 8, label: 'mysql' },
				{ value: 9, label: 'oracle' },
				{ value: 10, label: 'mssql' },
				{ value: 11, label: 'cache' },
			],
			formLabelWidth: '120px',
			rules: {
				name: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
				url: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
				type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
				authId: [{ required: true, message: '请输入认证ID', trigger: 'blur' }],
				userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
			},
			orderUserList: [],
		}
	},
	computed: {
		...mapState({
			orderUser: (state) => state.orderUser,
			orderUserNormal: (state) => state.orderUserNormal,
		}),
	},
	mounted() {
		this.initData()
	},
	methods: {
		initData() {
			this.orderUserList = []
			if (this.type === 'edit') {
				this.formData.id = this.detailData['id']
				this.formData.name = this.detailData['name']
				this.formData.url = this.detailData['url']
				this.formData.type = this.detailData['type']
				this.formData.authId = this.detailData['authId']
				this.formData.userName = this.detailData['userName']
				this.formData.password = this.detailData['password']

				const sendUser = this.detailData['sendUser']
				this.formData.sendUser = sendUser
				if (!!sendUser) {
					const checkUser = this.orderUserNormal.find((user) => user.userId === sendUser)
					if (!!checkUser.teamId) {
						this.orderUserList.push(checkUser.teamId + 100000)
					}
					this.orderUserList.push(checkUser.userId)
				}
			}
		},
		submitForm() {
			this.$refs.formAddEdit.validate((valid) => {
				if (valid) {
					const len = this.orderUserList.length
					this.formData.sendUser = len ? this.orderUserList[len - 1] : undefined
					ApiDatabase[this.type === 'edit' ? 'update' : 'save'](this.formData).then((res) => {
						console.log(res)
						if (res.status === 1) {
							this.$emit('handleSubmit')
						}
					})
				}
			})
		},
		closeDialog() {
			this.$emit('handleClose')
		},
	},
}
</script>