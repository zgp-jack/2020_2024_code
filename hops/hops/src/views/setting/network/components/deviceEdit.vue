<template>
	<div class="networkEdit">
		<el-form :model="formData">
			<el-form-item label="厂商" :label-width="formLabelWidth">
				<el-input v-model="formData.manufactor" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="型号" :label-width="formLabelWidth">
				<el-input v-model="formData.model" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="CPU利用率" :label-width="formLabelWidth">
				<el-input v-model="formData.oidCpuRate" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="内存利用率" :label-width="formLabelWidth">
				<el-input v-model="formData.oidMemoryRate" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="已使用内存" :label-width="formLabelWidth">
				<el-input v-model="formData.oidMemoryUse" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="空闲内存" :label-width="formLabelWidth">
				<el-input v-model="formData.oidMemoryFree" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="温度" :label-width="formLabelWidth">
				<el-input v-model="formData.oidTemperature" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="接口列表" :label-width="formLabelWidth">
				<el-input v-model="formData.oidInterface" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="接口IP" :label-width="formLabelWidth">
				<el-input v-model="formData.oidInterfaceIp" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="标准带宽" :label-width="formLabelWidth">
				<el-input v-model="formData.oidBandWidth" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="风扇" :label-width="formLabelWidth">
				<el-input v-model="formData.fan" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="接口状态" :label-width="formLabelWidth">
				<el-input v-model="formData.interfaceStatus" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="出字节" :label-width="formLabelWidth">
				<el-input v-model="formData.oidOutByte" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="入字节" :label-width="formLabelWidth">
				<el-input v-model="formData.oidInByte" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="出报文数" :label-width="formLabelWidth">
				<el-input v-model="formData.oidOutMessageCount" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="入报文数" :label-width="formLabelWidth">
				<el-input v-model="formData.oidInMessageCount" autocomplete="off"></el-input>
			</el-form-item>
			<!-- <el-form-item label="维护人员" :label-width="formLabelWidth">
				<el-cascader v-model="orderUserList" :options="orderUser" :show-all-levels="false" filterable style="width: 100%;"></el-cascader>
			</el-form-item> -->
			<el-form-item label=""></el-form-item>
		</el-form>
		<slot name="submit"></slot>
	</div>
</template>
<script>
import { mapState } from 'vuex';
export default {
	name: 'deviceEdit',
	props: ['formData', 'oidTableData'],
	data() {
		return {
			formLabelWidth: '',
			visible: false,
			// orderUserList: []
		}
	},
	computed: {
		...mapState({
            // orderUser: state => state.orderUser,
			// orderUserNormal: state => state.orderUserNormal,
        })
	},
	mounted() {
		// this.orderUserList = [];
		// const sendUser = this.formData['sendUser'];
		// if(!!sendUser) {
		// 	const checkUser = this.orderUserNormal.find(user => user.userId === sendUser);
		// 	if(!!checkUser.teamId) {
		// 		this.orderUserList.push(checkUser.teamId + 100000);
		// 	}
		// 	this.orderUserList.push(checkUser.userId);
		// }
	},
	methods: {
		submitForm() {},
	},
	watch: {
		// orderUserList: {
		// 	handler: function(val) {
		// 		const len = val.length;
		// 		this.formData.sendUser = len ? val[len - 1] : undefined;
		// 	},
		// 	deep: true
		// }
	}
}
</script>