<template>
    <div class="large-screen-box">
        <!-- <el-row class="large-top">
            <el-col :span="5">
                <div class="large-left-top">
                    <span class="large-big-title">{{ config.name }}</span>
                    <span class="large-sub-title">{{ config.department }}</span>
                </div>
            </el-col>
            <el-col :span="14">
                <div class="large-middle-top">
                    <TopName :dataTotal="dataScreenUp" :type="monitorType" :topInfo="topInfo" :dbInfo="dbInfo"></TopName>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="large-right-top">
                    <div class="large-btn"><i class="el-icon-receiving"></i> 3D机房</div>
                    <div class="large-btn" @click="handleGoBack"><i class="el-icon-close"></i> 退出</div>
                </div>
            </el-col>
        </el-row> -->
        <div class="large-top">
            <Top :config="config" :dataTotal="dataScreenUp" :type="monitorType" :topInfo="topInfo" :dbInfo="dbInfo"></Top>
        </div>
        <el-row style="height: calc(100% - 16px); position: relative; top: -76px">
            <el-col :span="6" class="flex-column">
                <div class="large-left-center">
                    <BusinessLeft v-if="showBusiness && planId" :planId="planId"></BusinessLeft>
                    <HostLeft
                        v-if="showHost"
                        :searchId="businessId"
                        @setTopInfo="setTopInfo"
                        @setListMem="setListMem"
                        @setListIdle="setListIdle"
                        @setListTemperature="setListTemperature"
                        @setListDisk="setListDisk"
                        ></HostLeft>
                    <NetLeft v-if="showNet" :searchId="businessId" @setTopInfo="setTopInfo" @setTempTrendData="setTempTrendData"></NetLeft>
                    <DatabaseMysqlLeft v-if="showDatabaseMysql" :searchId="businessId" @setTopInfo="setTopInfo" @setDBInfo="setDBInfo"></DatabaseMysqlLeft>
                    <DatabaseOracleLeft v-if="showDatabaseOrcale" :searchId="businessId" @setTopInfo="setTopInfo" @setDBInfo="setDBInfo"></DatabaseOracleLeft>
                    <DatabaseMssqlLeft v-if="showDatabaseMssql" :searchId="businessId" @setTopInfo="setTopInfo" @setDBInfo="setDBInfo"></DatabaseMssqlLeft>
                    <DatabaseCacheLeft
                        v-if="showDatabaseCache"
                        :searchId="businessId"
                        @setTopInfo="setTopInfo"
                        @setDBInfo="setDBInfo"
                        @setThreadList="setThreadList"
                        @setTask="setCacheTaskList"
                        @setDiskList="setDiskList"
                    ></DatabaseCacheLeft>
                    <MiddleIisLeft v-if="showMiddleIis" :searchId="businessId" @setTopInfo="setTopInfo" @setTableData="setTableDataIIS"></MiddleIisLeft>
                    <MiddleJvmLeft
                        v-if="showMiddleJvm"
                        :searchId="businessId"
                        @setTopInfo="setTopInfo"
                        @setList="setHeapMemoryUsageList"
                        @setcodeList="setcodeList"
                    ></MiddleJvmLeft>
                    <MiddleTomcatLeft
                        v-if="showMiddleTomcat"
                        :searchId="businessId"
                        @setTopInfo="setTopInfo"
                        @setList="setCountList"
                        @setThreadList="setThreadListTomcat"
                    ></MiddleTomcatLeft>
                </div>
            </el-col>
            <el-col :span="12" class="flex-column" style="padding-top: 76px; height: calc(100% - 24px);">
                <p class="large-label large-label-big">
                    {{ planName }}
                    <span class="large-btn" @click="reloadPage()">
                        <i class="el-icon-refresh"></i>刷新
                    </span>
                    <!-- <el-select v-model="planId" class="large-label-append">
                        <el-option v-for="item in planSelect" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select> -->
                    <!-- <el-cascader v-model="planListId" :options="planSelect" class="large-label-append" :props="{ multiple: true, checkStrictly: true }">
                        <template slot-scope="{ node, data }">
                            <span>{{ data.label }}</span>
                        </template>
                    </el-cascader> -->
                    <el-select class="large-label-append" multiple collapse-tags v-model="planListId" placeholder="请选择" @change="handleSelect">
                        <div style="padding: 0 20px;line-height:34px">
                            <el-checkbox v-model="planLoop" @change="handleCheckLoop">循环播放</el-checkbox>
                        </div>
                        <el-checkbox-group v-model="planListId" class="plan-checkbox-group">
                            <el-option v-for="item in planSelect" :key="item.value" :label="item.label" :value="item.value">
                                <el-checkbox style="pointer-events: none" :label="item.value">{{ item.label }}</el-checkbox>
                            </el-option>
                        </el-checkbox-group>
                    </el-select>
                </p>
                <div class="large-middle-center" style="height: 484px;">
                    <TogologView
                        class="togolog-container"
                        v-if="planId"
                        ref="planTopo"
                        style="height: 100%;"
                        :type="2"
                        :planId="planId"
                        @setWarn="getWarn"
                    ></TogologView>
                </div>
                <div class="network-main-warn">
                    <div class="network-main-warn-list">
                        <WarnList
                            v-if="planId"
                            ref="warnList"
                            style="flex: 1; min-height: 0"
                            :searchData="searchWarn"
                            :planId="planId"
                            :monitorTypeId="typeId"
                            :type="2"
                            :businessId="businessId"
                            :showTop="false"
                            :showFilter="false"
                            :showIcon="true"
                        ></WarnList>
                    </div>
                </div>
                <!-- <div style="position: relative;">
                    <div class="large-card large-card-3" style="height: 220px; padding: 0;">
                        <WarnList v-if="planId" class="large-warn" :searchData="searchWarn" :businessId="monitorId" :planId="planId" :showTop="false" :showFilter="false" :showIcon="true"></WarnList>
                    </div>
                </div> -->
            </el-col>
            <el-col :span="6"  class="flex-column">
                <div class="large-right-center">
                    <BusinessRight ref="businessRight" v-if="showBusiness && planId" :planId="planId" :dataTotal="dataScreenUp" @loadOver="handleLoadOver"></BusinessRight>
                    <HostRight v-if="showHost" :searchId="businessId" :listIdle="listIdle" :listDisk="listDisk" :listTemperature="listTemperature" :listMem="listMem" :memRate="memRate" ></HostRight>
                    <NetRight v-if="showNet" :searchId="businessId" :tempTrendData="tempTrendData"></NetRight>
                    <DatabaseMysqlRight v-if="showDatabaseMysql" :searchId="businessId"></DatabaseMysqlRight>
                    <DatabaseOracleRight v-if="showDatabaseOrcale" :searchId="businessId"></DatabaseOracleRight>
                    <DatabaseMssqlRight v-if="showDatabaseMssql" :searchId="businessId"></DatabaseMssqlRight>
                    <DatabaseCacheRight
                        v-if="showDatabaseCache"
                        :searchId="businessId"
                        :taskList="cacheTaskList"
                        :threadList="cacheThreadList"
                        :diskList="diskList"
                    ></DatabaseCacheRight>
                    <MiddleIisRight v-if="showMiddleIis" :searchId="businessId" :tableData="tableDataIIS"></MiddleIisRight>
                    <MiddleJvmRight v-if="showMiddleJvm" :searchId="businessId" :listData="heapMemoryUsageList" :codeList="codeList"></MiddleJvmRight>
                    <MiddleTomcatRight v-if="showMiddleTomcat" :searchId="businessId" :listData="countList" :threadList="threadListTomcat"></MiddleTomcatRight>
                </div>
            </el-col>
        </el-row>
        <!-- <div class="large-screen-bottom">
            <div class="large-screen-bottom-left el-col-5"></div>
            <div class="large-screen-bottom-center el-col-14"></div>
            <div class="large-screen-bottom-right el-col-5"></div>
        </div> -->
    </div>
</template>
<script>
import ApiLargeScreen from '@/api/large';
import { mapState } from 'vuex'
export default {
    name: 'largeScreen',
    components: {
		Top: () => import('./components/top.vue'),
        TogologView: () => import('@/components/togologView.vue'),
        BusinessLeft: () => import('./business/left.vue'),
        BusinessRight: () => import('./business/right.vue'),
        HostLeft: () => import('./host/left.vue'),
        HostRight: () => import('./host/right.vue'),
        NetLeft: () => import('./net/left.vue'),
        NetRight: () => import('./net/right.vue'),
        DatabaseMysqlLeft: () => import('./database/mysql/left.vue'),
        DatabaseMysqlRight: () => import('./database/mysql/right.vue'),
        DatabaseOracleLeft: () => import('./database/oracle/left.vue'),
        DatabaseOracleRight: () => import('./database/oracle/right.vue'),
        DatabaseMssqlLeft: () => import('./database/mssql/left.vue'),
        DatabaseMssqlRight: () => import('./database/mssql/right.vue'),
        DatabaseCacheLeft: () => import('./database/cache/left.vue'),
        DatabaseCacheRight: () => import('./database/cache/right.vue'),
        MiddleIisLeft: () => import('./middle/iis/left.vue'),
        MiddleIisRight: () => import('./middle/iis/right.vue'),
        MiddleJvmLeft: () => import('./middle/jvm/left.vue'),
        MiddleJvmRight: () => import('./middle/jvm/right.vue'),
        MiddleTomcatLeft: () => import('./middle/tomcat/left.vue'),
        MiddleTomcatRight: () => import('./middle/tomcat/right.vue'),
        WarnList: () => import('@/components/warnList.vue'),
    },
    data() {
        const endTime = new Date().getTime();
		const startTime = endTime - 86400000;
        return {
            tab2Active: '1',
            dataScreenUp: {
                service: {
                    totalNumber: 0,
                    alarmNumber: 0,
                    level: 0
                },
                host: {
                    totalNumber: 0,
                    alarmNumber: 0,
                    level: 0
                },
                device: {
                    totalNumber: 0,
                    alarmNumber: 0,
                    level: 0
                },
                db: {
                    totalNumber: 0,
                    alarmNumber: 0,
                    level: 0
                },
                middleware: {
                    totalNumber: 0,
                    alarmNumber: 0,
                    level: 0
                }
            },
            monitorType: {
                id: null,
                typeName: '',
                pid: 0
            },
            typeId: -1,
            businessId: -1,
            showBusiness: true,
            showHost: false,
            showNet: false,
            showDatabaseMysql: false,
            showDatabaseOrcale: false,
            showDatabaseMssql: false,
            showDatabaseCache: false,
            showMiddleIis: false,
            showMiddleJvm: false,
            showMiddleTomcat: false,
            topInfo: {
                name: '',
                ip: '',
                tip: ''
            },
            dbInfo: {
                uptime: 0,
                seriousAlerts: 0,
                applicationErrors: 0
            },

            checkAll: false, // 是否全选
            isIndeterminate: false,

            planId: null,
            planListId: [],

            searchWarn: {
                startTime: startTime,
				endTime: endTime,
            },
            planName: '',
            planIndex: 0,
            planDotsIndex: 0,
            planSelect: [],
            planList: [],
            //host
            listMem: [],
            memRate: 0,
            listIdle: [],
            listTemperature: [],
            listDisk: [],
            //net
            tempTrendData: [],
            //tomcat
            threadListTomcat: [],
            //cache
            cacheTaskList: [],
            cacheThreadList: [],
            diskList: [],
            //jvm
            codeList: [],
            heapMemoryUsageList: [],
            //tomcat
            countList: [],
            //iis
            tableDataIIS: [],

            timer: null,
            planLoop: sessionStorage.getItem('loop') === 'true',
            stopTrun: 0,
            businessRightOver: false,
            timerWarn: null
        }
    },
    computed: {
        config() {
            return this.$store.state.config;
        },
        planListIdClone() {
            return JSON.parse(JSON.stringify(this.planListId));
        },
        ...mapState({
            cycle: state => state.config.bigScreenCycle || 60000,
        })
    },
    mounted() {
        this.getTopPlan();
        this.timerWarn = setInterval(() => {
            //刷新warnList
            this.$refs['warnList'].reloadList();
        }, this.cycle)
    },
    beforeDestroy() {
        clearInterval(this.timer);
        clearInterval(this.timerWarn);
    },
    methods: {
        reloadPage() {
            location.reload()
        },
        // 下拉框选择事件
        handleSelect(value) {
            // this.planLoop = false;
            // if(!!this.timer) {
            //     clearInterval(this.timer);
            // }
            // console.log(value);
            // this.planId = value[value.length - 1];
            // this.planName = this.planList.filter(item => item.id === this.planId)[0].name;
        },
        // 全选事件
        handleCheckLoop(val) {
            if(val) {
                this.setLoop();
            }
            sessionStorage.setItem('loop', val);
        },
        setTopInfo(data) {
            this.topInfo = data;
        },
        setDBInfo(data) {
            this.dbInfo.uptime = data.uptime;
            this.dbInfo.seriousAlerts = data.seriousAlerts;
            this.dbInfo.applicationErrors = data.applicationErrors;
        },
        setShow(key) {
            this.showBusiness = false;
            this.showHost = false;
            this.showNet = false;
            this.showDatabaseMysql = false;
            this.showDatabaseOrcale = false;
            this.showDatabaseMssql = false;
            this.showDatabaseCache = false;
            this.showMiddleJvm = false;
            this.showMiddleIis = false;
            this.showMiddleTomcat = false;
            this[key] = true;
        },
        handleLoadOver(active) {
            this.businessRightOver = true;
        },
        wait() {
            let that = this;
            return new Promise((resolve, reject) => {
                var timer = setInterval(() => {
                    if(that.businessRightOver) {
                        clearInterval(timer);
                        resolve(true);
                    }
                }, 100)
            })
        },
        getTopPlan() {
            ApiLargeScreen.topPlan({type: 2, page: 1, pageSize: 99999}).then(res => {
                if(res.status === 1) {
                    this.planList = res.data.records;
                    this.planSelect = res.data.records.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    })
                    const isRotating = this.planList.filter(item => item.isRotating === 1);
                    this.planId = isRotating[0].id;
                    this.planListId = isRotating.map(item => {
                        return item.id
                    })
                    this.planName = isRotating[0].name;
                    this.getBusinessScreenUp();
                    this.setLoop();
                }
            })
        },
        saveTopPlan(changeVal, isAdd) {
            let params = this.planList.filter(plan => plan.id === changeVal)[0];
            params.isRotating = isAdd ? 1 : 0;
            ApiLargeScreen.planSave(params).then(res => {
                if(res.status === 0) {
                    this.$message.error(res.message);
                }
                this.getTopPlan();
            })
            
        },
        getDataByTime() {
            const isRotating =  this.planList.filter(item => item.isRotating === 1);
            const plan = isRotating[this.planIndex];
            let checked = false;
            this.planListId.map(item => {
                if(item === plan.id) {
                    checked = true;
                }
            })
            if(checked) {
                this.planName = plan.name;
                this.planId = plan.id;
                if(this.stopTrun > 0) {
                    if(this.stopTrun === 3) {
                        this.$refs['planTopo'].clearSelect();
                        this.getBusinessScreenUp();
                        this.getWarn({});
                    }
                    this.stopTrun--;
                    return false;
                }
                const item = plan.topPlanDots[this.planDotsIndex];
                this.getWarn(item);
                this.$refs['planTopo'].getClickNode(item.id);
                if(this.planDotsIndex === plan.topPlanDots.length - 1) {
                    this.stopTrun = 3;
                    this.planDotsIndex = -1;
                    this.planIndex = isRotating.length - 1 === this.planIndex ? 0 : this.planIndex + 1;
                    //一张拓扑图结束
                }
                this.planDotsIndex++;
            } else {
                this.planIndex = isRotating.length - 1 === this.planIndex ? 0 : this.planIndex + 1;
                this.planDotsIndex = 0;
            }
        },
        async setLoop() {
            this.planIndex = 0;
            this.planDotsIndex = 0;
            const loadOver = await this.wait();
            if(this.planLoop && loadOver) {
                clearInterval(this.timer);
                this.timer = null;
                this.timer = setInterval(() => {
                    if(!this.planLoop) {
                        clearInterval(this.timer);
                    } else {
                        //将timer id赋给全局timer，用户销毁时清楚
                        // this.timer = timer;
                        this.getDataByTime()
                    }
                }, this.cycle)
            }
        },
        getWarn(warn) {
            const RULETYPE = JSON.parse(sessionStorage.RuleType);
			this.typeId = warn.monitorType || -1;
			this.businessId = warn.monitorId || -1;
            if(this.typeId !== -1) {
                if(this.businessId === -1) {
                    return false;
                }
                let type = {};
                type = RULETYPE.filter(rule => rule.id === this.typeId)[0];
                // let pid = type.pid;
                // if(pid != 0) {
                //     type = RULETYPE.filter(rule => rule.id === pid)[0];
                // }
                this.monitorType = type;
                let key = 'showBusiness';
                switch(type.typeName) {
                    case '主机':
                    key = 'showHost';
                    break;
                    case '路由器':
                    case '交换机':
                    case '防火墙':
                    key = 'showNet';
                    break;
                    case 'mysql':
                    key = 'showDatabaseMysql';
                    break;
                    case 'oracle':
                    key = 'showDatabaseOrcale';
                    break;
                    case 'mssql':
                    key = 'showDatabaseMssql';
                    break;
                    case 'cache':
                    key = 'showDatabaseCache';
                    break;
                    case 'iis':
                    key = 'showMiddleIis';
                    break;
                    case 'jvm':
                    key = 'showMiddleJvm';
                    break;
                    case 'tomcat':
                    key = 'showMiddleTomcat';
                    break;
                    default: break;
                }
                this.setShow(key);
            } else {
                if(!warn.monitorType && !warn.monitorId) {
                    this.monitorType = {
                        typeName: '业务系统',
                        id: -1,
                        pid: 0
                    }
                    this.setShow('showBusiness');
                }
            };
            clearInterval(this.timerWarn);
            this.timerWarn = null;
            this.timerWarn = setInterval(() => {
                //刷新warnList
                this.$refs['warnList'].reloadList();
            }, this.cycle)
		},
        getBusinessScreenUp() {
            const endTime = new Date().getTime();
            const startTime = endTime - 86400000;
            ApiLargeScreen.screenUp({startTime, endTime, id: this.planId}).then(res => {
                if(res.status === 1) {
                    this.dataScreenUp = res.data;
                }
            })
        },
        setListMem(data) {
            this.listMem = data.list;
            this.memRate = data.data;
        },
        setListIdle(data) {
            this.listIdle = data;
        },
        setListTemperature(data) {
            this.listTemperature = data;
        },
        setThreadList(data) {
            this.cacheThreadList = data;
        },
        setCacheTaskList(data) {
            this.cacheTaskList = data;
        },
        setDiskList(data) {
            this.diskList = data;
        },
        setListDisk(data) {
            this.listDisk = data;
        },
        setcodeList(data) {
            this.codeList = data;
        },
        setHeapMemoryUsageList(data) {
            this.heapMemoryUsageList = data;
        },
        setCountList(data) {
            this.countList = data;
        },
        setTempTrendData(data) {
            this.tempTrendData = data;
        },
        setThreadListTomcat(data) {
            this.threadListTomcat = data;
        },
        //iis
        setTableDataIIS(data) {
            this.tableDataIIS = data;
        }
    },
    watch: {
        // planId: function(val) {
        //     this.getBusinessScreenUp();
        //     this.setShow('showBusiness');
        // }
        planListIdClone: {
            handler: function(newVal, oldVal) {
                const isAdd = newVal > oldVal;
                if(newVal.length === 0) {
                    this.$nextTick(() => {
                        this.$message('请至少选中一张拓扑图');
                        this.planListId = oldVal;
                    })
                } else {
                    let currt = false;
                    newVal.map(item => {
                        if(item === this.planId) {
                            currt = true;
                        }
                    })
                    if(!currt) {
                        // this.$nextTick(() => {
                        //     this.$message('当前正在播放该拓扑图');
                        //     this.planListId = oldVal;
                        // })
                        this.planIndex = this.planList.length - 1 === this.planIndex ? 0 : this.planIndex + 1;
                    }
                    //获取有差异的数据
                    let changeVal = [];
                    if(isAdd) {
                        changeVal = newVal.filter((v) =>
                            oldVal.every((val) => val != v)
                        )
                    } else {
                        changeVal = oldVal.filter((v) =>
                            newVal.every((val) => val != v)
                        )
                    }
                    if(oldVal.length != 0) {
                        this.saveTopPlan(changeVal[0], isAdd);
                    }
                    
                }
            },
            deep: true
        }
    }
}
</script>
<style scoped>
    
    .large-screen-box{
        font-family: 'DingTalk';
        width: 100%;
        height: 100%;
        background: #F2F8F6;
        box-shadow: inset 0px 100px 160px 128px #FFFFFF;
        position: relative;
        overflow: hidden;
    }
    .large-screen-box >>> .large-btn{
        border-radius: 4px;
        background: #e5efef;
        padding: 4px 8px;
        display: inline-block;
        color: #799F9F;
        cursor: pointer;
    }
    .large-screen-box >>> .large-btn i {
        color: #006666;
    }
    .large-screen-box >>> .large-btn+.large-btn{
        margin-left: 24px;
    }

    .large-label-big .large-btn{
        font-size: 12px;
        float: right;
        margin-right: 46px;
        margin-top: 19px;
        width: 60px;
        height: 24px;
        line-height: 16px;
        text-align: center;
    }
    
    .network-main-warn {
        position: relative;
        margin-top: 16px;
        padding-top: 50px;
        flex: 1;
        min-height: 0;
    }
    .network-main-warn-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding-left: 50px;
        padding-right: 85px;
        background-image: url(@/assets/network-label.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: 0 0;
        line-height: 50px;
    }
    .network-main-warn-list {
        width: 100%;
        height: calc(100% - 8px);
        margin-top: 8px;
        background-color: #fff;
        border-radius: 4px 4px 4px 4px;
    }
    
    .large-left-center{
        padding: 24px;
        flex: 1;
        min-height: 0;
    }
    .large-right-center{
        padding: 24px;
        flex: 1;
        min-height: 0;
    }
    .large-warn{
        flex:1;
        min-height: 0;
    }
</style>
<style>
    .flex-column{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .flex-1{
        flex: 1;
        min-height: 0;
        min-width: 0;
        height: 100%;
    }
    .large-label{
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        color: #2D856C;
        background-image: url(@/assets/label.svg);
        background-repeat:  no-repeat;
        background-size: 100% 100%;
        background-position: 0 0;
        padding-left: 51px;
        position: relative;
        background-color: transparent;
        box-shadow: 0px 4px 10px 0px rgba(3,104,104,0.22);
        margin: 16px 0 8px 0;
    }
    .large-label-append{
        float: right;
        margin-right: 16px;
        width: 220px;
        margin-top: 2px;
    }
    .large-label-append .el-input__inner{
        border-color: #E5F1F0;
        background-color: transparent;
        color: #888888;
    }
    .large-label-big{
        background-image: url(@/assets/label-1.svg) !important;
        box-shadow: 0px 4px 10px 0px rgba(3,104,104,0.22);
    }
    .large-sub-label{
        background: url(@/assets/label-sub-before.png) no-repeat 100% 100%;
        background-position: 0 6px;
        padding-left: 8px;
        display: inline-block;
        margin: 0 0 8px 0;
        width: fit-content;
        color: #2D856C;
        font-size: 16px;
    }
    .large-sub-label::after{
        content: '';
        width: auto;
        height: 2px;
        background-image: radial-gradient(closest-side at 50% 50%, #006666, #fff);
        display: block;
    }
    .large-sub-sub-label{
        color: #757e7e;
        text-align: left;
        font-size: 14px;
        display: inline-block;
        width: fit-content;
        margin-bottom: 8px;
    }
    .large-sub-sub-label::after{
        content: '';
        width: auto;
        height: 2px;
        background-image: radial-gradient(closest-side at 50% 50%, #006666, #fff);
        display: block;
    }
    .large-top{
        background-image: url(@/assets/label-top.svg);
        background-repeat:  no-repeat;
        background-size: calc( 100% + 24px );
        background-position: -12px -10px;
    }
    .large-screen-box .el-tabs__nav-wrap::after {
        background-color: transparent;
    }
    .large-screen-box .el-tabs__item{
        height: 22px;
        color: #757E7E;
    }
    .large-screen-box .el-tabs__item:hover,
    .large-screen-box .el-tabs__item.is-active{
        color: #006666;
    }
    .large-screen-box .el-tabs__active-bar {
        height: 3px;
        background-color: #006666;
        background: radial-gradient(#006666, rgba(0, 0, 0, 0));
        box-shadow: 0px 0px 10px 1px #006666;
    }
    .line-title{
        height: 18px;
        line-height: 18px;
        margin-bottom: 8px;
    }
    .line-title .line-title-legend{
        display:flex;
        font-size: 12px;
    }
    .line-title .line-title-legend .line-title-legend-item div{
        width: 8px;
        height: 8px;
        display: inline-block;
        margin-right: 4px;
    }
    .div-info{
        height: 48px;
        border-radius: 10px;
        opacity: 1;
        background: rgba(0, 102, 102, 0.1);
        font-size: 11px;
        color: #799f9f;
        padding: 4px 8px;
    }
    .div-info-inline {
        height: 28px;
        display: flex;
    }
    .div-info-inline .div-info-label{
        padding-top: 3px;
    }
    .div-info-inline .div-info-value{
        text-align: right;
        flex: 1;
        min-width: 0;
    }
    .div-info .div-info-value span{
        color: #006666;
        font-size: 14px;
        padding-right: 2px;
    }
    .large-screen-bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        height: 38px;
        width: 100%;
    }
    .large-screen-bottom .large-screen-bottom-left {
        background: url(@/assets/label-bottom-other.png) no-repeat 100% 100%;
        background-position: 16px 16px;
    }
    .large-screen-bottom .large-screen-bottom-center {
        background: url(@/assets/label-bottom-center.png) no-repeat 90% 100%;
        background-position: center;
    }
    .large-screen-bottom .large-screen-bottom-right {
        background: url(@/assets/label-bottom-other.png) no-repeat 100% 100%;
        background-position: 16px 16px;
        transform: rotateY(180deg);
    }
    .large-card{
        background-image: url(@/assets/large-card.svg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        box-shadow: 0px 4px 10px 0px rgba(3,104,104,0.22);
        padding: 16px;
        background-color: transparent;
    }
    .large-card+.large-card{
        margin-top: 5px;
    }
    .large-card-3{
        background-image: url(@/assets/large-card-3.svg);
    }
    .large-card-5{
        background-image: url(@/assets/large-card-5.svg);
    }
</style>