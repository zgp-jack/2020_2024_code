<template>
    <div style="overflow: hidden;">
        <el-row :gutter="16">
            <el-col :span="8">
                <div class="main-box" style="height: 128px;">
                    <h5 class="card-title">上线时间</h5>
                    <p class="base-info-value"><span>{{ basicData.uptime }}</span> 天</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="main-box" style="height: 128px;">
                    <h5 class="card-title">严重警报</h5>
                    <p class="base-info-value"><span>{{ basicData.seriousAlerts }}</span> 个</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="main-box" style="height: 128px;">
                    <h5 class="card-title">应用程序错误</h5>
                    <p class="base-info-value"><span>{{ basicData.applicationErrors }}</span> 个</p>
                </div>
            </el-col>
        </el-row>
        <div class="main-box" style="height: 130px; margin-top: 16px; width: 100%;">
            <h5 class="card-title" style="position: relative;">许可证</h5>
            
            <el-row class="lock-info-box">
                <el-col :span="8">
                    <p class="lock-info-label">最大许可单位</p>
                    <p><span class="lock-info-value">{{ basicData.licenseLimit }}</span></p>
                </el-col>
                <el-col :span="8">
                    <p class="lock-info-label">当前使用许可占比</p>
                    <p><span class="lock-info-value">{{ basicData.currentLicenseUse }}</span> 秒</p>
                </el-col>
                <el-col :span="8">
                    <p class="lock-info-label">最大许可使用占比</p>
                    <p><span class="lock-info-value">{{ basicData.highestLicenseUse }}</span> 秒</p>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="16" style="margin-top: 16px;">
            <el-col :span="12">
                <div class="main-box">
                    <h5 class="card-title">系统性能</h5>
                    <el-row class="basic-msg perf-msg" :gutter="49">
                        <el-col v-for="item in perfData" :span="24">
                            <label>{{ item.label }}</label>
                            <span :class="{'link': item.type === 'link'}">
                                {{ item.value + (item.unit ? item.unit : '')}}
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="main-box" style="padding-bottom: 50px;">
                    <h5 class="card-title">服务器指标</h5>
                    <el-row class="basic-msg metrics-msg" :gutter="49">
                        <el-col v-for="item in metricsData" :span="24">
                            <label>{{ item.label }}</label>
                            <span :class="{'link': item.type === 'link'}">
                                {{ item.value + (item.unit ? item.unit : '')}}
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <div class="main-box" style="margin-top: 16px;">
            <h5 class="card-title">系统使用情况</h5>
            <el-row class="basic-msg used-msg" :gutter="49">
                <el-col v-for="item in usedData" :span="12">
                    <label>{{ item.label }}</label>
                    <span :class="{'link': item.type === 'link'}">
                        {{ item.value + (item.unit ? item.unit : '')}}
                    </span>
                </el-col>
            </el-row>
            <h5 class="card-title" style="font-size: 16px; margin-top: 16px;">最活跃线程</h5>
            <el-table :data="threadList" style="height: 300px;">
                <el-table-column prop="processId" label="线程"> </el-table-column>
                <el-table-column prop="lines" label="执行代码行数"> </el-table-column>
            </el-table>
        </div>
        <div class="main-box" style="margin-top: 16px;">
            <h5 class="card-title">即将到来的任务</h5>
            <el-table :data="taskList" style="height: 300px;">
                <el-table-column prop="taskName" label="任务"> </el-table-column>
                <el-table-column prop="taskTime" label="时间"> </el-table-column>
                <el-table-column prop="taskStatus" label="状态"> </el-table-column>
            </el-table>
        </div>
        <div class="main-box" style="margin-top: 16px;">
            <h5 class="card-title">可用空间</h5>
            <el-table :data="diskList" height="300px">
                <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip fixed> </el-table-column>
                <el-table-column prop="directory" label="目录" width="180" show-overflow-tooltip fixed> </el-table-column>
                <el-table-column prop="maxSize" label="最大空间" width="80"> </el-table-column>
                <el-table-column prop="size" label="当前大小" width="80"> </el-table-column>
                <el-table-column prop="expansionSize" label="拓展大小" width="124"> </el-table-column>
                <el-table-column prop="available" label="可用大小" width="80"> </el-table-column>
                <el-table-column prop="freePercentage" label="可用比例" width="80"> </el-table-column>
                <el-table-column prop="diskFreeSpace" label="磁盘可用大小" width="120"> </el-table-column>
                <el-table-column prop="status" label="状态" width="80"> </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { formatTime } from '@/utils/util';
import ApiDatabase from '@/api/database';
export default {
    name: 'baseInfo',
    props: {
        searchData: {
            type: Object
        }
    },
    data() {
        return {
            basicData: {},
            perfData: {
                globalsPerSecond: {label: '每秒全局引用', value: ''},
                globalRefs: {label: '全局引用', value: ''},
                globalSets: {label: '全局设置数', value: ''},
                routineRefs: {label: '例程引用', value: ''},
                logicalRequests: {label: '逻辑请求', value: ''},
                diskReadsWrites: {label: '磁盘读写', value: ''},
                cacheEfficiency: {label: '缓存效率', value: ''},
            },
            metricsData: {
                applicationServers: {label: '应用服务器状态', value: ''},
                applicationServerTraffic: {label: '应用服务器流量', value: ''},
                dataServers: {label: '数据服务器状态', value: ''},
                dataServerTraffic: {label: '数据服务器流量', value: ''},
                shadowClients: {label: '影子客户端状态', value: ''},
                shadowServers: {label: '影子服务器状态', value: ''},
            },
            usedData: {
                databaseSpace: {label: '数据库磁盘', value: ''},
                journalSpace: {label: '日志磁盘', value: ''},
                lockTable: {label: '锁定表状态', value: ''},
                journalEntries: {label: '日志数', value: ''},
                writeDaemon: {label: '守护进程', value: ''},
                cspSessions: {label: 'CSP会话', value: ''},
                processes: {label: '运行进程', value: ''},
            },
            threadList: [],
            taskList: [],
            diskList: [],
            logList: []
        }
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        getInfo() {
            ApiDatabase.cacheInfo(this.searchData).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    if(!!data) {
                        console.log(data);
                        let upDay = parseInt(data.uptime / 86400);
                        if(data.uptime % 86400 != 0) {
                            upDay++;
                        }
                        this.basicData.uptime = upDay;
                        this.basicData['uptime'] = upDay;
                        this.basicData['seriousAlerts'] = data.errorAlerts.seriousAlerts;
                        this.basicData['applicationErrors'] = data.errorAlerts.applicationErrors;
                        this.basicData['currentLicenseUse'] = data.licensing.currentLicenseUse;
                        this.basicData['highestLicenseUse'] = data.licensing.highestLicenseUse;
                        this.basicData['licenseLimit'] = data.licensing.licenseLimit;
                        this.setPerfData(data.performance);
                        this.setMetricsData(data.ecpShadowing);
                        this.setUsedData(data.usage);
                        this.setTaskList(data.taskList);
                        this.setDiskList(data.databaseList);
                        this.$emit('setLogLost', data.xdbcLogList.map(item => {
                            //进程（1864），SQL代码（<-417>:<缓存安全错误>），错误（-），详情（身份验证错误）。
                            item['value'] = `进程（${item.processId}），SQL代码（${item.sqlCode}），错误（${item.error}），详情（${item.details}）。`
                            return item;
                        }));
                    }
                }
            })
        },
        setPerfData(data) {
            this.perfData['globalsPerSecond'].value = Number(data['globalsPerSecond']).toLocaleString();
            this.perfData['globalRefs'].value = Number(data['globalRefs']).toLocaleString();
            this.perfData['globalSets'].value = Number(data['globalSets']).toLocaleString();
            this.perfData['routineRefs'].value = Number(data['routineRefs']).toLocaleString();
            this.perfData['logicalRequests'].value = Number(data['logicalRequests']).toLocaleString();
            this.perfData['diskReadsWrites'].value = `读${Number(data['diskReads']).toLocaleString()}/写${Number(data['diskWrites']).toLocaleString()}`;
            this.perfData['cacheEfficiency'].value = Number(data['cacheEfficiency']).toLocaleString();
        },
        setMetricsData(data) {
            this.metricsData['applicationServerTraffic'].value = data.applicationServerTraffic;
            this.metricsData['applicationServers'].value = data.applicationServers
            this.metricsData['dataServerTraffic'].value = data.dataServerTraffic
            this.metricsData['dataServers'].value = data.dataServers
            this.metricsData['shadowClients'].value = data.shadowClients
            this.metricsData['shadowServers'].value = data.shadowServers
        },
        setUsedData(data) {
            this.usedData['databaseSpace'].value = data.databaseSpace;
            this.usedData['journalSpace'].value = data.journalSpace;
            this.usedData['lockTable'].value = data.lockTable;
            this.usedData['journalEntries'].value = Number(data.journalEntries).toLocaleString();
            this.usedData['writeDaemon'].value = data.writeDaemon;
            this.usedData['cspSessions'].value = Number(data.cspSessions).toLocaleString();
            this.usedData['processes'].value = data.processes;
            this.threadList = data.mostActiveProcesses.map(item => {
                item['lines'] = Number(item['lines']).toLocaleString();
                return item;
            });
        },
        setTaskList(data) {
            this.taskList = data;
        },
        setDiskList(data) {
            this.diskList = data;
        }
    }
}
</script>
<style scoped lang="scss">
.base-info-value{
    color: #006666;
    margin-top: 16px;
    span{
        font-size: 28px;
        font-weight: bold;
    }
}
.lock-info-box {
    color: #799F9F;
    margin-top: 7px;
    .lock-info-value{
        font-size: 28px;
        color: #006666;
        font-weight: bold;
    }
}
.card-title {
    span{
        padding-left: 14px;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			word-break: break-all;
			display: inline-block;
			flex: 1;
    }
}
.basic-msg{
    height: auto;
    .el-col{
        margin-top: 14px;
        display: flex;
    }
    label {
        width: 90px;
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
.metrics-msg{
    label {
        width: 110px;
    }
}
</style>