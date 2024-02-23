<template>
    <div style="overflow: hidden;">
        <el-row :gutter="16">
            <el-col :span="!mySqlShow && !OracleShow && !msSqlShow ? 12 : 8">
                <div class="main-box" style="height: 128px;">
                    <h5 class="card-title">上线时间</h5>
                    <p class="base-info-value"><span>{{ basicData.uptime }}</span> 天</p>
                </div>
            </el-col>
            <el-col :span="8" v-show="mySqlShow">
                <div class="main-box" style="height: 128px;">
                    <h5 class="card-title">InnoDB Buffer Pool Size</h5>
                    <p class="base-info-value"><span>{{ basicData.innoDBBufferPoolData }}</span> MB</p>
                </div>
            </el-col>
            <el-col :span="8" v-show="OracleShow">
                <div class="main-box" style="height: 128px;">
                    <h5 class="card-title">锁</h5>
                    <p class="base-info-value"><span class="link" @click="handleOpenDialog('oracleLock')">{{ lockList.length }}</span> 个</p>
                </div>
            </el-col>
            <el-col :span="8" v-show="msSqlShow">
                <div class="main-box" style="height: 128px;">
                    <h5 class="card-title">锁</h5>
                    <p class="base-info-value"><span class="link" @click="handleOpenDialog('mssqlLock')">{{ lockList.length }}</span> 个</p>
                </div>
            </el-col>
            <el-col :span="!mySqlShow && !OracleShow && !msSqlShow ? 12 : 8">
                <div class="main-box" style="height: 128px;">
                    <h5 class="card-title">慢查询</h5>
                    <p class="base-info-value"><span class="link" @click="handleOpenDialog('slow')">{{ slowList.length }}</span> 个</p>
                </div>
            </el-col>
        </el-row>
        <div class="main-box" style="height: 130px; margin-top: 16px; width: 100%;" v-show="mySqlShow">
            <h5 class="card-title" style="position: relative;">当前Lock信息</h5>
            
            <el-row class="lock-info-box">
                <div class="card-total link" @click="handleOpenDialog('lock')">查看记录</div>
                <el-col :span="8">
                    <p class="lock-info-label">当前行锁数</p>
                    <p><span class="lock-info-value">{{ basicData.innodbRowLockCurrentWaits }}</span></p>
                </el-col>
                <!-- <el-col :span="3">
                    <p class="lock-info-label">总行锁数</p>
                    <p><span class="lock-info-value">100</span></p>
                </el-col>
                <el-col :span="6">
                    <p class="lock-info-label">行锁总时长</p>
                    <p><span class="lock-info-value">27.141234</span> 秒</p>
                </el-col> -->
                <el-col :span="8">
                    <p class="lock-info-label">行锁平均时长</p>
                    <p><span class="lock-info-value">{{ basicData.innodbRowLockTimeAvg }}</span> 秒</p>
                </el-col>
                <el-col :span="8">
                    <p class="lock-info-label">行锁最大时长</p>
                    <p><span class="lock-info-value">{{ basicData.innodbRowLockTimeMax }}</span> 秒</p>
                </el-col>
            </el-row>
        </div>
        <el-dialog
        :title="title"
        :visible="visible"
        width="50%"
        @close="closeDialog">
            <el-table :data="tableData" style="width: 100%;" height="350">
                <el-table-column
                    v-for="item in tableHeader"
                    :type="item.type"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    show-overflow-tooltip
                >
                    <el-table-column
                        v-if="item.children"
                        v-for="child in item.children"
                        :type="child.type"
                        :key="child.prop"
                        :prop="child.prop"
                        :label="child.label"
                        :width="child.width"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                </el-table-column>
            </el-table>
        </el-dialog>
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
            basicData: {
                uptime: 0,
                innoDBBufferPoolData: 0,
                innodbRowLockCurrentWaits: 0,
                innodbRowLockTimeAvg: 0,
                innodbRowLockTimeMax: 0
            },
            OracleShow: false,
            mySqlShow: false,
            msSqlShow: false,
            visible: false,
            tableHeader: [],
            tableData: [],
            headerSlow: [
				{ type: 'index', label: '序号', width: '45px'},
				{ prop: 'sql', label: '语句', width: '240px' },
                { prop: 'count', label: '累计次数' },
                // {label:'等待时间(秒)', children: [
                //     { prop: 'minTimerWaitStr', label: '最小' },
                //     { prop: 'maxTimerWaitStr', label: '最大' },
                //     { prop: 'avgTimerWaitStr', label: '平均' },
                // ]}
                { prop: 'minTimerWaitStr', label: '最小等待时间(秒)' },
                { prop: 'maxTimerWaitStr', label: '最大等待时间(秒)' },
                { prop: 'avgTimerWaitStr', label: '平均等待时间(秒)' }
			],
            headerLock: [
                { type: 'index', label: '序号', width: '45px'},
				{ prop: 'name', label: '语句' },
				{ prop: 'ip', label: '事务开始时间' },
                { prop: 'processName', label: '等待锁开始时间' }
			],
            headerOracleLock: [
                { type: 'index', label: '序号', width: '45px'},
                { prop: 'sql', label: '语句', width: '360px' },
                { prop: 'typeName', label: '锁类型' },
                { prop: 'lmodeName', label: '锁模式' },
                { prop: 'sid', label: '会话标示符' }
            ],
            headerMsSqlLock: [
                { type: 'index', label: '序号', width: '45px'},
                { prop: 'tableName', label: '表名'},
                { prop: 'resourceType', label: '资源类型' },
                { prop: 'resourceDescription', label: '描述信息' },
                { prop: 'requestMode', label: '锁定模式' },
                { prop: 'requestStatus', label: '锁定状态' }
            ],
            title: '慢查询',
            slowList: [],
            lockList: []
        }
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        setShow() {
            const ruleType = JSON.parse(sessionStorage.getItem('RuleType'));
            this.mySqlShow = false;
            this.OracleShow = false;
            this.msSqlShow = false;
            ruleType.map(item => {
                if(item.id === this.searchData.dbType) {
                    switch (item.typeName) {
                        case 'mysql':
                            this.mySqlShow = true;
                            break;
                        case 'oracle':
                            this.OracleShow = true;
                            break;
                        case 'mssql':
                            this.msSqlShow = true;
                            break;
                        default:
                            break;
                    }
                }
            })
        },
        getInfo() {
            this.setShow();
            ApiDatabase.info(this.searchData).then(result => {
                // const result = res.data;
                if(result.status === 1) {
                    const data = result.data;
                    let upDay = parseInt(data.uptime / 86400);
                    if(data.uptime % 86400 != 0) {
                        upDay++;
                    }
                    this.basicData.uptime = upDay;
                    this.basicData.innoDBBufferPoolData = data.innoDBBufferPoolData;
                    this.basicData.innodbRowLockCurrentWaits = data.innodbRowLockCurrentWaits;
                    this.basicData.innodbRowLockTimeAvg = data.innodbRowLockTimeAvg;
                    this.basicData.innodbRowLockTimeMax = data.innodbRowLockTimeMax;
                    this.slowList = data.mysqlSlowInfo || [];
                    this.lockList = data.lockSqlInfo || [];

                }
            })
        },
        handleOpenDialog(key) {
            if(['slow', 'lock', 'oracleLock', 'mssqlLock'].indexOf(key) < 0) {
                return false;
            }
            switch (key) {
                case 'slow':
                    this.tableHeader = this.headerSlow;
                    this.tableData = this.slowList.map(item => {
                        item.minTimerWaitStr = item.minTimerWait ? parseInt(item.minTimerWait / 1000) : '--';
                        item.maxTimerWaitStr = item.maxTimerWait ? parseInt(item.maxTimerWait / 1000) : '--';
                        item.avgTimerWaitStr = item.avgTimerWait ? parseInt(item.avgTimerWait / 1000) : '--';
                        return item;
                    });
                    this.title = '慢查询';
                    break;
                case 'lock':
                    this.tableHeader = this.headerLock;
                    this.tableData = this.lockList;
                    this.title = 'Lock记录';
                    break;
                case 'oracleLock':
                    this.tableHeader = this.headerOracleLock;
                    this.tableData = this.lockList;
                    this.title = '锁';
                    break;
                case 'mssqlLock':
                    this.tableHeader = this.headerMsSqlLock;
                    this.tableData = this.lockList;
                    this.title = '锁';
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
</style>