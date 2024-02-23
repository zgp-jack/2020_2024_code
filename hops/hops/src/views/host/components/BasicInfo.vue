<template>
    <div>
        <el-row :gutter="49" class="basic-msg">
            <el-col :span="12" v-for="(item, key) in basicData" style="margin-top: 10px; display: flex;">
                <label>{{ item.label }}</label>
                <span :class="{'link': item.type === 'link'}" @click="handleOpenDialog(key, item)">
                    {{ item.value + (item.unit ? item.unit : '')}}
                </span>
            </el-col>
        </el-row>
        <el-dialog
        :title="title"
        :visible="visible"
        width="35%"
        @close="closeDialog">
            <el-table :data="tableData" style="width: 100%;" height="350">
                <el-table-column v-for="item in tableHeader" :key="item.prop" :prop="item.prop" :label="item.label"> </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import ApiHost from '@/api/host'
import { formatTime, getMaxUnitByBit } from '@/utils/util'
export default {
    name: 'basicInfo',
    props: {
        searchData: {
            type: Object
        }
    },
    data() {
        return {
            basicData: {
				computerName: {label: '计算机名', value: ''},
				manufacturer: {label: '品牌', value: ''},
				systemName: {label: '系统', value: ''},
				version: {label: '版本', value: ''},
				model: {label: '型号', value: ''},
				ip: {label: '管理地址', value: ''},
				firewallStatus: {label: '防火墙', value: ''},
				bootTime: {label: '开机时长', value: ''},
				cpuModel: {label: '处理器', value: ''},
				memTotal: {label: '内存', value: ''},
				diskTotal: {label: '磁盘', value: ''},
				net: {label: '网卡数量', value: '0', type: 'link', unit: '个'},
				tcpPort: {label: 'TCP端口', value: '0', type: 'link',},
				udpPort: {label: 'UDP端口', value: '0', type: 'link',},
				business: {label: '关联业务', value: '0', type: 'link', unit: '个'},
				type: {label: '类型', value: ''},
				addr: {label: '位置', value: ''},
			},
            listTcpPort: [],
            listUdpPort: [],
            visible: false,
            tableHeader: [],
            tableData: [],
            headerBusiness: [
				{ prop: 'name', label: '业务名称' }
			],
            headerTcp: [
                { prop: 'id', label: '序号' },
				{ prop: 'name', label: '端口名称' },
				{ prop: 'ip', label: 'IP' },
                { prop: 'processName', label: '关联应用' },
			],
            headerUdp: [
                { prop: 'id', label: '序号' },
				{ prop: 'name', label: '端口名称' },
				{ prop: 'ip', label: 'IP' },
                { prop: 'processName', label: '关联应用' },
			],
            headerNet: [
				{ prop: 'name', label: '名称' },
				{ prop: 'ip', label: '地址' },
                { prop: 'status', label: '状态' },
			],
            title: '业务'
        }
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        getInfo() {
            ApiHost.info(this.searchData).then(result => {
                // const result = res.data;
                if(result.status === 1) {
                    const data = result.data;
                    const memUsed = getMaxUnitByBit(data.memUsed, true);
                    const diskUsed = getMaxUnitByBit(data.diskUsed, true);
                    this.listTcpPort = (data.hostPortInfoList || []).filter(item => item.protocol === 1);
                    this.listUdpPort = (data.hostPortInfoList || []).filter(item => item.protocol === 2);
                    this.businessList = data.businessList || [];
                    this.networkCardList = data.hostNetworkVoList || [];
                    this.basicData['computerName'].value = data.computerName || '--';
                    this.basicData['manufacturer'].value = data.manufacturer || '--';
                    this.basicData['systemName'].value = data.systemName || '--';
                    this.basicData['version'].value = data.version || '--';
                    this.basicData['model'].value = data.model || '--';
                    this.basicData['firewallStatus'].value = data.firewallStatus || '--';
                    this.basicData['ip'].value = data.ip || '--';
                    this.basicData['bootTime'].value = data.bootTime ? formatTime(parseInt((new Date() - new Date(data.bootTime))/1000)) : '--';
                    this.basicData['cpuModel'].value = data.cpuModel || '--';
                    this.basicData['memTotal'].value = data.memTotal ? `${memUsed.num.toFixed(2)}${memUsed.unit}/${data.memTotal}` : '--';
                    this.basicData['diskTotal'].value = data.diskTotal ? `${diskUsed.num.toFixed(2)}${diskUsed.unit}/${data.diskTotal}` : '--';
                    this.basicData['net'].value = data.net || '--';
                    this.basicData['addr'].value = data.addr || '--';
                    this.basicData['type'].value = data.type || '--';
                    this.basicData['tcpPort'].value = this.listTcpPort.length;
                    this.basicData['udpPort'].value = this.listUdpPort.length;
                    this.basicData['business'].value = this.businessList.length;
                    this.basicData['net'].value = this.networkCardList.length;
                    this.$emit('setNetListData', this.networkCardList);
                }
                
            })
        },
        handleOpenDialog(key, item) {
            if(['tcpPort', 'udpPort', 'business', 'net'].indexOf(key) < 0) {
                return false;
            }
            switch (key) {
                case 'tcpPort':
                    this.tableHeader = this.headerTcp;
                    this.tableData = this.listTcpPort;
                    this.title = 'TCP端口';
                    break;
                case 'udpPort':
                    this.tableHeader = this.headerUdp;
                    this.tableData = this.listUdpPort;
                    this.title = 'UDP端口';
                    break;
                case 'business':
                    this.tableHeader = this.headerBusiness;
                    this.tableData = this.businessList;
                    this.title = '关联业务';
                    break;
                case 'net':
                    this.tableHeader = this.headerNet;
                    this.tableData = this.networkCardList;
                    this.title = '网卡';
                    break;
                default:
                    break;
            }
            this.visible = true;
        },
        closeDialog() {
            this.visible = false
        }
    }
}
</script>
<style lang="scss" scoped>
    .basic-msg{
		height: 280px;
		label {
			width: 60px;
			display: inline-block;
			position: relative;
		}
		label::after{
			content: ':';
			position: absolute;
			right: 0;
			top: 0;
		}
		span{
			color: #282827;
			padding-left: 14px;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			word-break: break-all;
			display: inline-block;
			flex: 1;
		}
        .link{
            text-decoration: underline;
            color: #006666;
            cursor: pointer;
        }
	}
</style>