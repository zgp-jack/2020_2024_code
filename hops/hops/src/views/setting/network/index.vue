
<template>
	<el-row class="settingRule">
		<el-col class="settingRule-main">
			<el-menu :default-active="activeIndex" active-text-color="#006666" mode="horizontal" @select="handleSelect">
				<el-menu-item v-for="item in menuNav" :key="item.id" :index="String(item.id)">
					<span slot="title">{{ item.typeName }}</span>
				</el-menu-item>
			</el-menu>
			<template v-if="activeIndex == 4">
				<NetWorkTopolog></NetWorkTopolog>
			</template>
			<template v-else-if="activeIndex == 5">
				<AutoNetworkTopolog></AutoNetworkTopolog>
			</template>
			<template v-else>
				<NetworkTable v-if="activeIndex != '1'" :tableHeader="tableHeader[activeIndex]" :tableData="tableData">
					<template #search>
						<el-form v-if="activeIndex != '1'" :inline="true" :model="formInline" class="demo-form-inline">
							<el-form-item label="" v-if="activeIndex != '2'">
								<el-input v-model="formInline.name" placeholder="名称"></el-input>
							</el-form-item>
							<!-- <el-form-item label="">
							<el-input v-model="formInline.type" placeholder="类型"></el-input>
						</el-form-item> -->
							<el-form-item>
								<div class="common-btn" v-if="activeIndex != '2'" @click="search">查询</div>
								<div class="common-btn" v-if="activeIndex != '1' && activeIndex != '3'" @click="add">新增</div>
							</el-form-item>
							<el-form-item style="float: right" v-if="activeIndex == '0'">
								<div class="common-btn" @click="handleDown">下载模板</div>
								<el-upload
									:action="uploadUrl"
									:show-file-list="false"
									:on-success="handleUploadSuccess"
									:on-error="handleUploadError"
									:before-upload="handleUploadBefore"
									:headers="myHeaders"
									accept=".xlsx,.xls"
									style="display: inline-block"
								>
									<div class="common-btn"><i class="pageImport-img"></i>导入</div>
								</el-upload>
								<div class="common-btn" @click="handleExport">导出</div>
							</el-form-item>
						</el-form>
					</template>
					<template #operation>
						<el-table-column label="操作" align="center" v-if="activeIndex != '1' && activeIndex != '3'">
							<template slot-scope="scope">
								<span title="编辑" @click="change(scope.row)"><i class="el-icon-s-tools"></i></span>
								<span title="另建" v-if="activeIndex == '2'" @click="copy(scope.row)"><i class="el-icon-s-order"></i></span>
								<span title="删除" @click="delData(scope.row)"><i class="el-icon-delete-solid"></i></span>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="center" v-if="activeIndex == '1'">
							<template slot-scope="scope">
								<span title="编辑" v-if="scope.row.name != '-'" @click="change(scope.row)"><i class="el-icon-s-tools"></i></span>
							</template>
						</el-table-column>
					</template>
					<el-pagination
						style="float: right; margin-top: 16px"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-size="pageSize"
						:page-sizes="[10, 20, 50, 100]"
						layout="sizes,total,prev, pager, next, jumper"
						@size-change="handleSizeChange"
						:total="total"
					>
					</el-pagination>
				</NetworkTable>
				<DeviceTable v-else :tableHeader="tableHeader[activeIndex]" :tableData="tableData">
					<template #operation>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<span title="编辑" v-if="scope.row.deviceName != '-'" @click="change(scope.row)"><i class="el-icon-s-tools"></i></span>
							</template>
						</el-table-column>
					</template>
					<el-pagination
						style="float: right; margin-top: 16px"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-size="pageSize"
						:page-sizes="[10, 20, 50, 100]"
						layout="sizes,total,prev, pager, next, jumper"
						@size-change="handleSizeChange"
						:total="total"
					>
					</el-pagination>
				</DeviceTable>
			</template>
		</el-col>
		<el-dialog :title="dialogTitle" :visible.sync="visible" v-if="visible" width="650px" :close-on-click-modal="false" :show-close="false" center>
			<NetworkEdit v-if="activeIndex == '0'" :formData="formData" :dialogTitle="dialogTitle" :oidTableData="oidTableData">
				<template #submit>
					<span slot="footer" class="dialog-footer dialog-submit">
						<el-button @click="visible = false">取 消</el-button>
						<el-button type="primary" @click="submitForm">确 定</el-button>
					</span>
				</template>
			</NetworkEdit>
			<PortEdit v-if="activeIndex == '1'" :formData="formData">
				<template #submit>
					<span slot="footer" class="dialog-footer dialog-submit">
						<el-button @click="visible = false">取 消</el-button>
						<el-button type="primary" @click="submitForm">确 定</el-button>
					</span>
				</template>
			</PortEdit>
			<DeviceEdit v-if="activeIndex == '2'" :formData="formData">
				<template #submit>
					<span slot="footer" class="dialog-footer dialog-submit">
						<el-button @click="visible = false">取 消</el-button>
						<el-button type="primary" @click="submitForm">确 定</el-button>
					</span>
				</template>
			</DeviceEdit>
		</el-dialog>
	</el-row>
</template>
<script>
import { ApiNetwork, ApiNetworkList, delNetwork } from '@/api'
import { MessageBox } from 'element-ui'
export default {
	name: 'settingNetwork',
	components: {
		NetworkEdit: () => import('./components/networkEdit.vue'),
		NetworkTable: () => import('./components/networkTable.vue'),
		DeviceEdit: () => import('./components/deviceEdit.vue'),
		PortEdit: () => import('./components/portEdit1.vue'),
		DeviceTable: () => import('./components/deviceTable.vue'),
		NetWorkTopolog: () => import('./networkTopolog.vue'),
		AutoNetworkTopolog: () => import('./autoNetworkTopolog.vue'),
	},
	data() {
		return {
			visible: false,
			dialogTitle: '新增',
			activeIndex: '0',
			menuNav: [
				{ id: 0, typeName: '网络设备' },
				{ id: 1, typeName: '设备端口' },
				{ id: 2, typeName: '设备oid' },
				{ id: 3, typeName: '端口oid' },
				{ id: 4, typeName: '网络拓扑' },
				{ id: 5, typeName: '拓扑测绘' },
			],
			tableHeader: [
				[
					{ prop: 'index', label: '序号', type: 'index' },
					{ prop: 'name', label: '名称' },
					{ prop: 'typeName', label: '类型' },
					{ prop: 'manufactor', label: '厂商' },
					{ prop: 'model', label: '型号' },
					{ prop: 'managerIp', label: '管理地址' },
					{ prop: 'managerPort', label: '管理端口' },
					{ prop: 'targetIp', label: 'snmp IP' },
					{ prop: 'port', label: 'snmp端口' },
					{ prop: 'position', label: '位置' },
					// { prop: 'snmpVersion', label: '版本' },
					// { prop: 'snmpTeam', label: '团体名' },
					// { prop: 'snmpLevel', label: '认证等级' },
					// { prop: 'snmpName', label: '用户名' },
					// { prop: 'snmpPass', label: '密码' },
					// { prop: 'snmpAuth', label: '认证方式' },
					// { prop: 'snmpPrivacy', label: '授权方式' },
					// { prop: 'snmpPrivacyKey', label: '秘钥' },
				],
				[
					// { prop: 'index', label: '序号', type: 'index' },
					{ prop: 'portName', label: '设备名称' },
					// { prop: 'deviceName', label: '设备名称' },
					{ prop: 'name', label: '端口名称' },
					{ prop: 'ip', label: 'IP' },
					{ prop: 'standardBandWidth', label: '参考带宽' },
					{ prop: 'portSpeed', label: '实时流量' },
					{ prop: 'statusName', label: '状态' },
				],
				[
					{ prop: 'index', label: '序号', type: 'index' },
					{ prop: 'manufactor', label: '厂家' },
					{ prop: 'model', label: '型号' },
					{ prop: 'oidCpuRate', label: 'CPU利用率' },
					{ prop: 'oidMemoryRate', label: '内存利用率' },
					{ prop: 'oidMemoryUse', label: '已使用内存' },
					{ prop: 'oidMemoryFree', label: '空闲内存' },
					{ prop: 'oidTemperature', label: '温度' },
					{ prop: 'oidInterface', label: '接口列表' },
					{ prop: 'oidInterfaceIp', label: '接口IP' },
					{ prop: 'oidBandWidth', label: '标准带宽' },
					{ prop: 'fan', label: '风扇' },
					{ prop: 'interfaceStatus', label: '接口状态' },
					{ prop: 'oidOutByte', label: '出字节' },
					{ prop: 'oidInByte', label: '入字节' },
					{ prop: 'oidOutMessageCount', label: '出报文数' },
					{ prop: 'oidInMessageCount', label: '入报文数' },
				],
				[
					{ prop: 'index', label: '序号', type: 'index' },
					{ prop: 'name', label: '名称' },
					{ prop: 'ip', label: 'IP' },
					{ prop: 'bandWidth', label: '带宽' },
					{ prop: 'outByte', label: '出字节' },
					{ prop: 'inByte', label: '入字节' },
					{ prop: 'outMessageCount', label: '出报文数' },
					{ prop: 'inMessageCount', label: '入报文数' },
				],
				[],
				[],
			],
			tableData: [],
			oidTableData: [],
			formData: {},
			formInline: {}, // '/network/device/interface/page'
			url: ['/network/device/page', '/network/device/page', '/network/device/snmp/oid/listPage', '/network/device/interface/oid/listPage', '', ''],
			uploadUrl: '/api/network/device/importData',
			myHeaders: { token: sessionStorage.getItem('TOKEN') },
			currentPage: 1,
			pageSize: 10,
			total: 0,
		}
	},
	mounted() {
		this.getList()
		this.getOption()
	},
	methods: {
		search() {
			this.currentPage = 1
			this.getList()
		},
		handleSizeChange(val) {
			this.currentPage = 1
			this.pageSize = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.getList()
		},
		getOption() {
			ApiNetworkList(this.url[2], { page: 1, pageSize: 20 }).then((res) => {
				if (res.status == 1) {
					this.oidTableData = res.data.records
				}
			})
		},
		handleSelect(key) {
			this.activeIndex = key
			if (key == 4 || key == 5) {
			} else {
				this.formInline = {}
				this.tableData = []
				this.getList()
			}
		},
		copy(data) {
			this.dialogTitle = '新增'
			this.visible = true
			this.formData = { ...data, id: undefined }
		},
		change(data) {
			this.dialogTitle = '编辑'
			this.visible = true
			this.formData = { ...data }
		},
		getList() {
			let params = {
				page: this.currentPage,
				pageSize: this.pageSize,
				...this.formInline,
			}
			this.tableData = []
			ApiNetworkList(this.url[this.activeIndex], params).then((res) => {
				if (res.status == 1) {
					if (this.activeIndex == '1') {
						res.data.records.forEach((item) => {
							item.hasChildren = true
							item.portName = item.name
							item.name = '-'
							item.deviceName = '-'
							item.ip = '-'
							item.standardBandWidth = '-'
							item.portSpeed = '-'
							item.statusName = '-'
						})
					}
					this.total = res.data.total
					this.tableData = res.data.records
				}
			})
		},
		add() {
			this.dialogTitle = '新增'
			this.visible = true
			this.formData = {}
			// this.formData = { timeList: ['00:00:01', '23:59:59'] }
		},
		delData(data) {
			MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			})
				.then(() => {
					let url = [`/network/device/delete`, '', '/network/device/snmp/oid/delete']
					ApiNetworkList(url[this.activeIndex], data.id, 'delete').then((res) => {
						if (res.status == 1) {
							this.$message({
								type: 'success',
								message: '删除成功!',
							})
							this.getList()
						}
					})
				})
				.catch(() => {})
		},
		submitForm() {
			let params = {
				...this.formData,
			}
			if (this.dialogTitle == '新增') {
				let url = [`/network/device/save`, '', '/network/device/snmp/oid/save']
				ApiNetworkList(url[this.activeIndex], params).then((res) => {
					if (res.status == 1) {
						this.$message({
							type: 'success',
							message: '新增成功!',
						})
						this.visible = false
						this.currentPage = 1
						this.getList()
					}
				})
			} else {
				let url = [`/network/device/update`, '/network/device/interface/update', '/network/device/snmp/oid/save']
				if (this.activeIndex == 1) {
					params.standardBandWidth = params.standardBand
				}
				ApiNetworkList(url[this.activeIndex], params).then((res) => {
					if (res.status == 1) {
						this.$message({
							type: 'success',
							message: '修改成功!',
						})
						this.visible = false
						this.getList()
					}
				})
			}
		},
		handleDown() {
			ApiNetworkList('/network/device/downExportTemp', {}).then((res) => {
				if (res.status === 1) {
					window.open(`/file/${res.data}`)
				}
			})
		},
		handleExport() {
			let params = {
				...this.formInline,
				page: this.currentPage,
				pageSize: this.pageSize,
			}
			ApiNetworkList('/network/device/exportData', params).then((res) => {
				if (res.status === 1) {
					window.open(`/file/${res.data}`)
				}
			})
		},
		//上传相关
		handleUploadSuccess: function (response, file, fileList) {
			if (response.status == 1) {
				this.getList()
			} else {
			}
		},
		handleUploadError: function (err, file, fileList) {
			console.log('返回错误内容：')
			console.log(err, file, fileList)
		},
		handleUploadBefore: function (file) {},
	},
}
</script>
<style lang="scss" scoped>
.settingRule {
	display: flex;
	height: 100%;
	padding: 16px;
}
.settingRule-main {
	width: 100%;
	height: calc(100% - 61px);
	background-color: #fff;
}
.common-btn {
	// margin-bottom: 16px;
}
.dialog-submit {
	display: flex;
	justify-content: space-around;
}
</style>