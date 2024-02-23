<template>
    <div class="top-name-box">
        <el-row>
            <el-col :span="7">
                <!-- <div class="large-left-top" v-if="!showBusiness">
                    <span class="large-big-title">{{ config.name }}</span>
                    <span class="large-sub-title">{{ config.department }}</span>
                </div>
                <div style="width: 100%;height: 1px;" v-else></div> -->
                <div style="width: 100%;height: 1px;" v-if="showBusiness"></div>
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
                        <div class="top-name-info-db">
                            <p>上线时间<span>{{ dbInfo.uptime }}</span>天</p>
                        </div>
                        <div class="line"></div>
                        <span style="text-align: right;">{{ topInfo.tip }}</span>
                        <div class="line"></div>
                        <span style="text-align: left;">{{ topInfo.ip }}</span>
                    </div>
                </div>
                <div class="top-name-info" v-if="showInfoDataBaseCache">
                    <div class="top-name-info-db">
                        <p>上线时间<span>{{ dbInfo.uptime }}</span>天</p>
                        <!-- <p style="width: auto; max-width: 120px;">严重警报<span>{{ dbInfo.seriousAlerts }}</span>个</p>
                        <p style="text-align: left;">应用程序错误<span>{{ dbInfo.applicationErrors }}</span>个</p> -->
                    </div>
                    <p class="top-name-info-label">{{ topInfo.name }}</p>
                    <div class="top-name-info-info">
                        <span style="text-align: right;">{{ topInfo.tip }}</span>
                        <div class="line"></div>
                        <span style="text-align: left;">{{ topInfo.ip }}</span>
                    </div>
                </div>
            </el-col>
            <el-col :span="10">
                <div class="large-middle-top">
                    <div class="large-center-top">
                        <!-- <span class="large-big-title">{{ config.name }}</span>
                        <span class="large-sub-title">{{ config.department }}</span> -->
                        <img src="@/assets/logo-name.png" />
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="large-right-top">
                    <!-- <div class="large-btn"><i class="el-icon-receiving"></i> 3D机房</div> -->
                    <div class="large-btn" @click="handleGoBack"><i class="el-icon-close"></i> 退出</div>
                </div>
            </el-col>
        </el-row>
        
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
        handleGoBack() {
            const name = 'index';
            this.$router.push({name: name});
            sessionStorage.setItem('navAction', name)
			this.$store.commit('updateNavAction', name)
        },
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
        height: 90px;
        position: relative;
        z-index: 99;
    }
    .large-left-top{
        height: 34px;
        line-height: 34px;
        width: 100%;
        text-align: left;
        .large-big-title{
            font-size: 24px;
            padding-left: 24px;
        }
    }
    .large-center-top{
        width: 100%;
        text-align: center;
        img{
            height: 56px;
            margin: 6px auto;
        }
    }
    .large-big-title{
        font-size: 28px;
        background: linear-gradient(360deg, #2D856C 54%, #CCE0E0 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .large-sub-title {
        color: #555555;
        font-size: 12px;
        margin-left: 8px;
    }
    .large-middle-center{
        flex: 1;
        min-height: 0;
    }
    .large-right-top{
        position: relative;
        height: 34px;
        text-align: right;
        padding-right: 24px;
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
        text-align: left;
        line-height: 32px;
        padding-left: 24px;
        .top-name-info-label{
            background: linear-gradient(360deg, #2D856C 54%, #CCE0E0 100%);
            background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
            width: initial;
            text-align: center;
            font-size: 24px;
            font-weight: 400;
            line-height: 36px;
            max-width: 200px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            vertical-align: bottom;
        }
        .top-name-info-info{
            color: #555555;
            font-size: 12px;
            line-height: 20px;
            display: inline-block;
            padding-left: 8px;
            span{
                display: inline-block;
                width: auto;
                max-width: 130px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                word-break: break-all;
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
            color: #555555;
            font-size: 12px;
            display: inline-block;
            padding-right: 8px;
            p{
                width: 100%;
                display: inline-block;
                span{
                    color: #006666;
                    padding: 0 4px;
                }
            }
            
        }
    }
    .large-btn{
        background: linear-gradient(180deg, #F7FCFB 0%, #EAF7F4 98%) !important;
        box-shadow: 0px 4px 10px 0px rgba(3,104,104,0.22);
        border-radius: 4px;
        color: #2D856C !important;
        height: 36px;
        line-height: 36px;
        padding: 0 8px !important;
    }
</style>