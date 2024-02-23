<template>
    <div class="top-name-box">
        <el-row v-if="showBusiness" class="top-name-content">
            <el-col :span="25">
                <div class="top-name-item">
                    <div class="large-btn"><i class="iconfont icon-xitongguanli" /> 业务系统</div>
                    <ul>
                        <li><p>总数<span>{{ dataTotal.service.totalNumber }}</span>套</p></li>
                        <li><p>告警<span :class="'level-' + dataTotal.service.level">{{ dataTotal.service.alarmNumber }}</span>套</p></li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="25">
                <div class="top-name-item">
                    <div class="large-btn"><i class="iconfont icon-fuwuqi" /> 主机</div>
                    <ul>
                        <li><p>总数<span>{{ dataTotal.host.totalNumber }}</span>台</p></li>
                        <li><p>告警<span :class="'level-' + dataTotal.host.level">{{ dataTotal.host.alarmNumber }}</span>台</p></li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="25">
                <div class="top-name-item">
                    <div class="large-btn"><i class="iconfont icon-wangluotuopu" /> 网络</div>
                    <ul>
                        <li><p>总数<span>{{ dataTotal.device.totalNumber }}</span>台</p></li>
                        <li><p>告警<span :class="'level-' + dataTotal.device.level">{{ dataTotal.device.alarmNumber }}</span>台</p></li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="25">
                <div class="top-name-item">
                    <div class="large-btn"><i class="iconfont icon-shujuku" /> 数据库</div>
                    <ul>
                        <li><p>总数<span>{{ dataTotal.db.totalNumber }}</span>套</p></li>
                        <li><p>告警<span :class="'level-' + dataTotal.db.level">{{ dataTotal.db.alarmNumber }}</span>套</p></li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="25">
                <div class="top-name-item">
                    <div class="large-btn"><i class="iconfont icon-middle" /> 中间件</div>
                    <ul>
                        <li><p>总数<span>{{ dataTotal.middleware.totalNumber }}</span>套</p></li>
                        <li><p>告警<span :class="'level-' + dataTotal.middleware.level">{{ dataTotal.middleware.alarmNumber }}</span>套</p></li>
                    </ul>
                </div>
            </el-col>
        </el-row>
        <div class="top-name-info" v-if="showInfo">
            <p class="top-name-info-label">{{ topInfo.name }}</p>
            <div class="top-name-info-info">
                <span style="text-align: right;">{{ topInfo.tip }}</span>
                <div class="line"></div>
                <span style="text-align: left;">{{ topInfo.ip }}</span>
            </div>
        </div>
        <div class="top-name-info" v-if="showInfoDataBase">
            <p class="top-name-info-label">{{ topInfo.name }}</p>
            <div class="top-name-info-info">
                <span style="text-align: right;">{{ topInfo.tip }}</span>
                <div class="line"></div>
                <span style="text-align: left;">{{ topInfo.ip }}</span>
            </div>
            <div class="top-name-info-db">
                <p>上线时间<span>{{ dbInfo.uptime }}</span>天</p>
            </div>
        </div>
        <div class="top-name-info" v-if="showInfoDataBaseCache">
            <p class="top-name-info-label">{{ topInfo.name }}</p>
            <div class="top-name-info-info">
                <span style="text-align: right;">{{ topInfo.tip }}</span>
                <div class="line"></div>
                <span style="text-align: left;">{{ topInfo.ip }}</span>
            </div>
            <div class="top-name-info-db">
                <p style="text-align: right;">上线时间<span>{{ dbInfo.uptime }}</span>天</p>
                <p style="width: 300px;">严重警报<span>{{ dbInfo.seriousAlerts }}</span>个</p>
                <p style="text-align: left;">应用程序错误<span>{{ dbInfo.applicationErrors }}</span>个</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'top',
    props: {
        dataTotal: {
            type: Object,
            default: () => {
                return {
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
                }
            }
        },
        type: {
            type: Object,
            default: () => {
                return {}
            }
        },
        topInfo: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    ip: '',
                    tip: ''
                }
            }
        },
        dbInfo: {
            type: Object,
            default: () => {
                return {
                    uptime: 0,
                    seriousAlerts: 0,
                    applicationErrors: 0
                }
            }
        },
        config: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    department: ''
                }
            }
        }
    },
    data() {
        return {
            showBusiness: true,
            showInfo: false,
            showInfoDataBase: false,
            showInfoDataBaseCache: false
        }
    },
    mounted() {
        
    },
    methods: {
        setShow(key) {
            this.showBusiness = false;
            this.showInfo = false;
            this.showInfoDataBase = false;
            this.showInfoDataBaseCache = false;
            this[key] = true;
        },
        setTop(type) {
            let key = 'showBusiness';
            switch(type.typeName) {
                case '主机':
                key = 'showInfo'
                break;
                case '路由器':
                case '交换机':
                case '防火墙':
                key = 'showInfo'
                break;
                case 'mysql':
                case 'oracle':
                case 'mssql':
                key = 'showInfoDataBase'
                break;
                case 'cache':
                key = 'showInfoDataBaseCache'
                break;
                case 'iis':
                case 'jvm':
                case 'tomcat':
                key = 'showInfo'
                break;
                default: break;
            }
            this.setShow(key);
        }
    },
    watch: {
        type: {
            handler: function(val) {
                this.setTop(val);
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
<style lang="scss" scoped>
    .top-name-box{
        background: url(@/assets/top-bottom.png) no-repeat 100% 100%;
        background-position: center bottom;
        height: 100px;
        padding: 16px 0;
    }
    .top-name-content{
        width: 800px;
        margin: auto;
        text-align: center;
        .top-name-item {
            display: inline-block;
            margin: auto;
            position: relative;
        }
        ul{
            border-left: 1px solid #edf0ef;
            list-style: none;
            padding: 0;
            text-align: left;
            margin-top: -6px;
            position: absolute;
            left: 8px;
            li{
                vertical-align: bottom;
                width: 124px;
                color: #799F9F;
                p{
                    position: relative;
                    display: inline-block;
                    top: 10px;
                    width: 110px;
                    font-size: 11px;
                    span{
                        font-size: 14px;
                        font-weight: bold;
                        padding: 0 2px;
                        color: #006666;
                    }
                    .level-1{
                        color: #65ADEB;
                    }
                    .level-2{
                        color: #ffd400;
                    }
                    .level-3{
                        color: #ff836b;
                    }
                }
            }
            li::before{
                content: '';
                display: inline-block;
                width: 14px;
                height: 1px;
                background-color: #edf0ef;
                vertical-align: bottom;
            }
        }
    }
    .top-name-info{
        text-align: center;
        .top-name-info-label{
            color: #282827;
            text-align: center;
            font-size: 28px;
            font-weight: 400;
            line-height: 36px;
        }
        .top-name-info-info{
            color: #757e7e;
            font-size: 12px;
            line-height: 20px;
            span{
                display: inline-block;
                width: 160px;
                vertical-align: top;
            }
            .line{
                display: inline-block;
                width: 1px;
                height: 10px;
                background-color: #ccc;
                margin: 5px 8px 0 8px;
            }
        }
        .top-name-info-db{
            display: flex;
            color: #799F9F;
            font-size: 12px;
            p{
                width: 100%;
                span{
                    color: #006666;
                }
            }
            
        }
    }
</style>