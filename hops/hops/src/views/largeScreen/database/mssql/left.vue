<template>
    <div class="business-left">
        <p class="large-label">基本情况</p>
        <div class="large-card">
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">锁</p>
                        <p class="div-info-value"><span>{{ lockList.length }}</span>个</p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">慢查询</p>
                        <p class="div-info-value"><span>{{ slowList.length }}</span>个</p>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="8" style="margin-top: 8px">
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">当前每秒查询数</p>
                        <p class="div-info-value"><span>{{ qpsData }}</span>个/秒</p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="div-info">
                        <p class="div-info-label">当前每秒事物数</p>
                        <p class="div-info-value"><span>{{ tpsData }}</span>个/秒</p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="flex-1" style="margin-top: 16px">
            <div class="large-card" style="height: 50%;">
                <LineChart domId="lineLink" height="100%" :units="['个']" :legend="['活跃连接数', '最大已使用连接数']" :seriesData1="connectList[0]" :seriesData2="connectList[1]">
                    <template v-slot:title>
                        <div  class="line-title">
                            <span class="large-sub-sub-label">连接数</span>
                            <div class="line-title-legend" style="float: right">
                                <div class="line-title-legend-item" style="margin-right:16px"><div style="background-color: #006666"></div>活跃连接数</div>
                                <div class="line-title-legend-item"><div style="background-color: #ffbc00"></div>最大已使用连接数</div>
                            </div>
                        </div>
                    </template>
                </LineChart>
            </div>
            <div class="large-card" style="height: 50%;">
                <LineChart domId="lineThread" height="100%" :units="['个']" :seriesData1="TreadsList[0]" :legend="['活跃线程数', '最大线程数']" :seriesData2="TreadsList[1]">
                    <template v-slot:title>
                        <div class="line-title">
                            <span class="large-sub-sub-label">线程</span>
                            <div class="line-title-legend" style="float: right">
                                <div class="line-title-legend-item" style="margin-right:16px"><div style="background-color: #006666"></div>活跃线程数</div>
                                <div class="line-title-legend-item"><div style="background-color: #ffbc00"></div>最大线程数</div>
                            </div>
                        </div>
                    </template>
                </LineChart>
            </div>
        </div>
    </div>
</template>
<script>
import ApiDatabase from '@/api/database';
import { getMaxUnitByBit, getValueByUnit, getMaxUnitByFlow } from '@/utils/util';
const RULETYPE = JSON.parse(sessionStorage.getItem('RuleType'))
export default {
    name: 'databaseLeft',
    props: {
        searchId: {
            type: Number
        }
    },
    components: {
        LineChart: () => import('../../components/line.vue'),
    },
    data() {
        const endTime = parseInt(new Date().getTime());
        const startTime = endTime - 86400000;
        return {
            basicData: {
                uptime: 0,
                innoDBBufferPoolData: 0,
                innodbRowLockCurrentWaits: 0,
                innodbRowLockTimeAvg: 0,
                innodbRowLockTimeMax: 0
            },
            qpsData: 0,
            tpsData: 0,
            slowList: [],
            lockList: [],
            connectList: [],
            TreadsList: [],
            searchData: {
                startTime: startTime,
                endTime: endTime,
                dbType: 10
            },
            timer: null
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getInfo();
        this.getInfoData(1, 'qpsData');
        this.getInfoData(2, 'tpsData');
        this.getChartData(3, 'connectList');
        this.getChartData(4, 'TreadsList');
        this.timer = setInterval(() => {
            this.setTime();
            this.getInfo();
            this.getInfoData(1, 'qpsData');
            this.getInfoData(2, 'tpsData');
            this.getChartData(3, 'connectList');
            this.getChartData(4, 'TreadsList');
        }, cycle)
    },
    beforeDestroy(){
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
            ApiDatabase.info(params).then(result => {
                // const result = res.data;
                if(result.status === 1) {
                    const data = result.data;
                    let upDay = parseInt(data.uptime / 86400);
                    if(data.uptime % 86400 != 0) {
                        upDay++;
                    }
                    this.basicData.uptime = upDay;
                    this.basicData.innoDBBufferPoolData = data.innoDBBufferPoolData || 0;
                    this.basicData.innodbRowLockCurrentWaits = data.innodbRowLockCurrentWaits;
                    this.basicData.innodbRowLockTimeAvg = data.innodbRowLockTimeAvg;
                    this.basicData.innodbRowLockTimeMax = data.innodbRowLockTimeMax;
                    this.slowList = data.mysqlSlowInfo || [];
                    this.lockList = data.lockSqlInfo || [];
                    this.$emit('setDBInfo', {uptime: upDay});
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
        getInfoData(type, args) {
            const params = {
                dataType: type,
                dbId: this.searchId,
                ...this.searchData
            }
            ApiDatabase.trendData(params).then(result => {
                if(result.status === 1) {
                    this[args] = result.data[0].current;
                }
            })
        },
        getChartData(type, args) {
            const params = {
                dataType: type,
                dbId: this.searchId,
                ...this.searchData
            }
            ApiDatabase.trendData(params).then(result => {
                if(result.status === 1) {
                    let max = 0;
                    let unit = 'B';
                    const size = result.data.length;
                    
                    result.data.forEach((item, index) => {
                        max = item.max > max ? item.max : max;
                    })
                    unit = args === 'FlowList' ? getMaxUnitByFlow(max).unit : getMaxUnitByBit(max).unit;
                    this[args + 'Unit'] = [unit];
                        
                    result.data.forEach((item,index) => {
                        const list = item.data;
                        let data = [];
                        list.forEach((item, index) => {
                            data.push([item.time, getValueByUnit(item.value, unit)]);
                        });
                        this[args].push(data);
                    })
                }
            })
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