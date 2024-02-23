<template>
	<div>
		<el-form :model="formData" :rules="rules" ref="formAddEdit">
			<el-form-item label="主机名称" prop="computerName" :label-width="formLabelWidth">
				<el-input v-model="formData.computerName" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="IP" prop="ip" :label-width="formLabelWidth">
				<el-input v-model="formData.ip" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="认证ID" prop="authId" :label-width="formLabelWidth">
				<el-input v-model="formData.authId" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="采集范围" :label-width="formLabelWidth">
				<el-select v-model="scopeCollection" placeholder="请选择采集范围" multiple>
					<el-option label="基础信息" value="isBase"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="位置" :label-width="formLabelWidth">
				<el-input v-model="formData.addr" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="维护人员" :label-width="formLabelWidth">
				<el-cascader v-model="orderUserList" :options="orderUser" :show-all-levels="false" filterable style="width: 100%;"></el-cascader>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="closeDialog">取 消</el-button>
			<el-button type="primary" @click="submitForm">确 定</el-button>
		</div>
	</div>
</template>
<script>
import ApiHost from '@/api/host';
import { mapState } from 'vuex';
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
					computerName: '',
					ip: '',
					authId: '',
					addr: '',
					isBase: 0,
					isIis: 0,
					sendUser: null
				}
			},
		},
	},
	data() {
		return {
			formData: {
				id: null,
				computerName: '',
				ip: '',
				authId: '',
				addr: '',
				isBase: 0,
				isIis: 0,
				sendUser: null
			},
			scopeCollection: [],
			formLabelWidth: '120px',
			rules: {
				computerName: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
				authId: [{ required: true, message: '请输入认证ID', trigger: 'blur' }]
			},
			orderUserList: [],
			// wxUserList: []
		}
	},
	computed: {
		...mapState({
			// wxUser: state => state.wxUser,
            orderUser: state => state.orderUser,
			orderUserNormal: state => state.orderUserNormal,
        })
	},
	mounted() {
		this.initData()
	},
	methods: {
		initData() {
			this.scopeCollection = [];
			this.orderUserList = [];
			if (this.type === 'edit') {
				this.formData.id = this.detailData['id']
				this.formData.computerName = this.detailData['computerName']
				this.formData.ip = this.detailData['ip']
				this.formData.authId = this.detailData['authId']
				this.formData.addr = this.detailData['addr']
				this.formData.isBase = this.detailData['isBase']
				this.formData.isIis = this.detailData['isIis']

				const sendUser = this.detailData['sendUser'];
				this.formData.sendUser = sendUser;
				if(!!sendUser) {
					const checkUser = this.orderUserNormal.find(user => user.userId === sendUser);
					if(!!checkUser.teamId) {
						this.orderUserList.push(checkUser.teamId + 100000);
					}
					this.orderUserList.push(checkUser.userId);
				}
				if (this.detailData['isBase'] === 1) {
					this.scopeCollection.push('isBase')
				}
				if (this.detailData['isIis'] === 1) {
					this.scopeCollection.push('isIis')
				}
			} else {
				this.formData = {
					id: null,
					computerName: '',
					systemName: '',
					version: '',
					authId: '',
					addr: '',
					isBase: 0,
					isIis: 0,
					sendUser: null
				}
			}
		},
		submitForm() {
			this.$refs.formAddEdit.validate((valid) => {
				if (valid) {
					this.formData.isBase = this.scopeCollection.indexOf('isBase') >= 0 ? 1 : 0;
					this.formData.isIis = this.scopeCollection.indexOf('isIis') >= 0 ? 1 : 0;
					const len = this.orderUserList.length;
					this.formData.sendUser = len ? this.orderUserList[len - 1] : undefined;
					ApiHost[this.type === 'edit' ? 'update' : 'save'](this.formData).then((res) => {
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
	watch: {
		detailData(newV) {
			this.initData()
		},
	},
}
</script>