<template>
    <div class="business-left">
        <p class="large-label">基本情况</p>
        <div class="large-card">
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="8">
                    <div class="div-info">
                        <p class="div-info-label">最大许可单位</p>
                        <p class="div-info-value"><span>{{ basicData.licenseLimit }}</span></p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="div-info">
                        <p class="div-info-label">当前使用许可占比</p>
                        <p class="div-info-value"><span>{{ basicData.currentLicenseUse }}</span>秒</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="div-info">
                        <p class="div-info-label">最大许可使用占比</p>
                        <p class="div-info-value"><span>{{ basicData.highestLicenseUse }}</span>秒</p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">严重警报</p>
                        <p class="div-info-value"><span>{{ basicData.seriousAlerts }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">应用程序错误</p>
                        <p class="div-info-value"><span>{{ basicData.applicationErrors }}</span></p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="large-card">
            <span class="large-sub-label">系统性能</span>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">全局引用</p>
                        <p class="div-info-value"><span>{{ perfData.globalRefs }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">每秒全局引用</p>
                        <p class="div-info-value"><span>{{ perfData.globalsPerSecond }}</span></p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">全局设置数</p>
                        <p class="div-info-value"><span>{{ perfData.globalSets }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">例程引用</p>
                        <p class="div-info-value"><span>{{ perfData.routineRefs }}</span></p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">逻辑请求</p>
                        <p class="div-info-value"><span>{{ perfData.logicalRequests }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">缓存效率</p>
                        <p class="div-info-value"><span>{{ perfData.cacheEfficiency }}</span></p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">磁盘读写</p>
                        <p class="div-info-value"><span>{{ perfData.diskReadsWrites }}</span></p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="large-card">
            <span class="large-sub-label">服务器指标</span>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">应用服务器状态</p>
                        <p class="div-info-value"><span>{{ metricsData.applicationServers }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">应用服务器流量</p>
                        <p class="div-info-value"><span>{{ metricsData.applicationServerTraffic }}</span></p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">数据服务器状态</p>
                        <p class="div-info-value"><span>{{ metricsData.dataServers }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">数据服务器流量</p>
                        <p class="div-info-value"><span>{{ metricsData.dataServerTraffic }}</span></p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">影子服务器状态</p>
                        <p class="div-info-value"><span>{{ metricsData.shadowClients }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">影子服务器流量</p>
                        <p class="div-info-value"><span>{{ metricsData.shadowServers }}</span></p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="large-card">
            <span class="large-sub-label">系统使用情况</span>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">日志数</p>
                        <p class="div-info-value"><span>{{ usedData.journalEntries }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">CSP会话</p>
                        <p class="div-info-value"><span>{{ usedData.cspSessions }}</span></p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">数据库磁盘</p>
                        <p class="div-info-value"><span>{{ usedData.databaseSpace }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">日志磁盘</p>
                        <p class="div-info-value"><span>{{ usedData.journalSpace }}</span></p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">锁定表状态</p>
                        <p class="div-info-value"><span>{{ usedData.lockTable }}</span></p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">守护进程</p>
                        <p class="div-info-value"><span>{{ usedData.writeDaemon }}</span></p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info div-info-inline">
                        <p class="div-info-label">运行进程</p>
                        <p class="div-info-value"><span>{{ usedData.processes }}</span></p>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
const RULETYPE = JSON.parse(sessionStorage.getItem('RuleType'))
import ApiDatabase from '@/api/database';
export default {
    name: 'businessLeft',
    props: {
        searchId: {
            type: Number
        }
    },
    components: {
        IndexTable: () => import('../../components/table.vue'),
    },
    data() {
        const endTime = parseInt(new Date().getTime());
        const startTime = endTime - 86400000;
        return {
            basicData: {},
            perfData: {
                globalsPerSecond: '',
                globalRefs: '',
                globalSets: '',
                routineRefs: '',
                logicalRequests: '',
                diskReadsWrites: '',
                cacheEfficiency: '',
            },
            metricsData: {
                applicationServers: '',
                applicationServerTraffic: '',
                dataServers: '',
                dataServerTraffic: '',
                shadowClients: '',
                shadowServers: '',
            },
            usedData: {
                databaseSpace: '',
                journalSpace: '',
                lockTable: '',
                journalEntries: '',
                writeDaemon: '',
                cspSessions: '',
                processes: '',
            },
            threadList: [],
            searchData: {
                startTime: startTime,
                endTime: endTime,
                dbType: 11
            },
            timer: null
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getInfo();
        this.timer = setInterval(() => {
            this.setTime();
            this.getInfo();
        }, cycle)
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        setTime() {
            const endTime = parseInt(new Date().getTime());
		    const startTime = endTime - 86400000;
            this.searchData.startTime = startTime;
            this.searchData.endTime = endTime;
        },
        getInfo() {
            const params = {
                dbId: this.searchId,
                ...this.searchData
            }
            ApiDatabase.cacheInfo(params).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    if(!!data) {
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
                        this.$emit('setDBInfo', {uptime: upDay, seriousAlerts: data.errorAlerts.seriousAlerts, applicationErrors: data.errorAlerts.applicationErrors});
                    }
                }
            })
            ApiDatabase.list(params).then((result) => {
				if (result.status === 1) {
					if (!!this.searchId) {
						const row = result.data.filter((item) => item.id === this.searchId)[0];
                        const typeName = RULETYPE.filter((r) => r.id === row.type)[0]['typeName'];
                        this.$emit('setTopInfo', {name: row.name, tip: typeName, ip: row.url});
					}
                }
            })
        },
        setPerfData(data) {
            this.perfData['globalsPerSecond'] = Number(data['globalsPerSecond']).toLocaleString();
            this.perfData['globalRefs'] = Number(data['globalRefs']).toLocaleString();
            this.perfData['globalSets'] = Number(data['globalSets']).toLocaleString();
            this.perfData['routineRefs'] = Number(data['routineRefs']).toLocaleString();
            this.perfData['logicalRequests'] = Number(data['logicalRequests']).toLocaleString();
            this.perfData['diskReadsWrites'] = `读${Number(data['diskReads']).toLocaleString()}/写${Number(data['diskWrites']).toLocaleString()}`;
            this.perfData['cacheEfficiency'] = Number(data['cacheEfficiency']).toLocaleString();
        },
        setMetricsData(data) {
            this.metricsData['applicationServerTraffic'] = data.applicationServerTraffic;
            this.metricsData['applicationServers'] = data.applicationServers
            this.metricsData['dataServerTraffic'] = data.dataServerTraffic
            this.metricsData['dataServers'] = data.dataServers
            this.metricsData['shadowClients'] = data.shadowClients
            this.metricsData['shadowServers'] = data.shadowServers
        },
        setUsedData(data) {
            this.usedData['databaseSpace'] = data.databaseSpace;
            this.usedData['journalSpace'] = data.journalSpace;
            this.usedData['lockTable'] = data.lockTable;
            this.usedData['journalEntries'] = Number(data.journalEntries).toLocaleString();
            this.usedData['writeDaemon'] = data.writeDaemon;
            this.usedData['cspSessions'] = Number(data.cspSessions).toLocaleString();
            this.usedData['processes'] = data.processes;
            this.threadList = data.mostActiveProcesses.map(item => {
                item['lines'] = Number(item['lines']).toLocaleString();
                return item;
            });
            
            this.$emit('setThreadList', this.threadList);
        },
        setTaskList(data) {
            this.taskList = data;
            this.$emit('setTask', this.taskList);
        },
        setDiskList(data) {
            this.diskList = data;
            this.$emit('setDiskList', this.diskList);
        }
    }
}
</script>
<style lang="scss" scoped>
.business-left{
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>