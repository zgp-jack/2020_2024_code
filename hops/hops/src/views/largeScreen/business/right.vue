<template>
    <div class="business-right">
        <p class="large-label">业务故障频次</p>
        <el-tabs class="large-card large-card-5" v-model="tab2Active" @tab-click="handleTabClick" style="padding-top: 4px; height: 360px;">
            <el-tab-pane name="1">
                <span slot="label"><i class="el-icon-date"></i> 本月</span>
                <Bar :tableData="listAlarmRank"></Bar>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label"><i class="el-icon-date"></i> 本周</span>
                <Bar :tableData="listAlarmRank"></Bar>
            </el-tab-pane>
            <el-tab-pane name="3">
                <span slot="label"><i class="el-icon-date"></i> 今日</span>
                <Bar :tableData="listAlarmRank"></Bar>
            </el-tab-pane>
        </el-tabs>
        <p class="large-label">整体情况</p>
        <div class="large-card flex-1 large-card-5">
            <div class="overall-box">
                <div class="overall-left">
                    <div class="overall-business" ref="overallBusiness">
                        <p>业务系统</p>
                        <ul>
                            <li>总数<span>{{ dataTotal.service.totalNumber }}</span>套</li>
                            <li>告警<span :class="'level-' + dataTotal.service.level">{{ dataTotal.service.alarmNumber }}</span>套</li>
                        </ul>
                    </div>
                </div>
                <div class="overall-line" v-if="showReally">
                    <div class="line-svg"></div>
                    <!-- <div v-html="drawLineSize(1)" class="line1"></div>
                    <div v-html="drawLineSize(2)" class="line2"></div>
                    <div v-html="drawLineSize(3)" class="line3"></div>
                    <div v-html="drawLineSize(4)" class="line4"></div> -->
                </div>
                <div class="overall-right">
                    <div class="overall-item overall-host" ref="overallHost">
                        <p>主机</p>
                        <ul>
                            <li>总数<span>{{ dataTotal.host.totalNumber }}</span>台</li>
                            <li>告警<span :class="'level-' + dataTotal.host.level">{{ dataTotal.host.alarmNumber }}</span>台</li>
                        </ul>
                    </div>
                    <div class="overall-item overall-net" ref="overallNet">
                        <p>网络</p>
                        <ul>
                            <li>总数<span>{{ dataTotal.device.totalNumber }}</span>台</li>
                            <li>告警<span :class="'level-' + dataTotal.device.level">{{ dataTotal.device.alarmNumber }}</span>台</li>
                        </ul>
                    </div>
                    <div class="overall-item overall-database" ref="overallDB">
                        <p>数据库</p>
                        <ul>
                            <li>总数<span>{{ dataTotal.db.totalNumber }}</span>套</li>
                            <li>告警<span :class="'level-' + dataTotal.db.level">{{ dataTotal.db.alarmNumber }}</span>套</li>
                        </ul>
                    </div>
                    <div class="overall-item overall-middle" ref="overallMiddle">
                        <p>中间件</p>
                        <ul>
                            <li>总数<span>{{ dataTotal.middleware.totalNumber }}</span>套</li>
                            <li>告警<span :class="'level-' + dataTotal.middleware.level">{{ dataTotal.middleware.alarmNumber }}</span>套</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ApiLargeScreen from '@/api/large';
import { drawLine } from '@/utils/util'
export default {
    name: 'businessRight',
    props:{
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
        planId: {
            type: [Number, String]
        },
    },
    components: {
        Bar: () => import('../components/bar.vue'),
    },
    data() {
        const endTime = new Date();
        const m = endTime.getMonth();
        const y = endTime.getFullYear();
		const startTime = new Date(y, m, 1, 0, 0, 0);
        return {
            tab2Active: '1',
            tab2Check: {'1' : '2', '2' : '3', '3' : '1'},
            listAlarmRank: [],
            searchData: {
				startTime: startTime.getTime(),
				endTime: endTime.getTime(),
			},
            timer: null,
            timer1: null,
            showReally: false,
            timeCount: 0
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getBusinessAlarmRank();
        this.timer = setInterval(() => {
            this.setTime();
            this.handleTabClick({name: this.tab2Active});
        }, cycle)
        this.$nextTick(() => {
            this.showReally = true;
        })
        this.timer1 = setInterval(() => {
            this.timeCount += 500;
            if(this.timeCount >=20000) {
                this.$emit('loadOver');
                this.timeCount = 0;
            }
        }, 500);
    },
    beforeDestroy(){
        clearInterval(this.timer);
        clearInterval(this.timer1);
    },
    methods: {
        setTime() {
            this.tab2Active =  this.tab2Check[this.tab2Active];
        },
        getTimeCount() {
            //返回倒计时
            return this.timeCount;
        },
        getBusinessAlarmRank() {
            const params = {
                ...this.searchData,
                id: this.planId
            }
            ApiLargeScreen.alarmRank(params).then(res => {
                if(res.status === 1) {
                    let total = 0;
                    res.data.map(item => {
                        total += item.num;
                    })
                    this.listAlarmRank = res.data.map(item => {
                        return {
                            name: item.name,
                            value: parseInt(item.num/total * 100),
                            num: item.num,
                            unit: '个'
                        }
                    })
                }
            })
        },
        handleTabClick(item) {
            let startTime = 0;
            let endTime = 0;
            let now = new Date(); //当前日期 
            let nowDayOfWeek = now.getDay() === 0 ? 7 : now.getDay() - 1; //今天本周的第几天 
            let nowDay = now.getDate(); //当前日 
            let nowMonth = now.getMonth(); //当前月 
            let nowYear = now.getFullYear(); //当前年
            endTime = now;
            switch (item.name) {
                case "1":
                startTime = new Date(nowYear, nowMonth, 1);
                break;
                case "2":
                startTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                break;
                case "3":
                startTime = new Date(nowYear, nowMonth, nowDay, 0, 0, 0);
                break;
            }
            this.searchData.startTime = startTime.getTime();
            this.searchData.endTime = endTime.getTime();
            this.getBusinessAlarmRank();
            this.$emit('setTabActive', parseInt(item.name))
        },
        drawLineSize(key) {
            let domLine = '';
            switch(key) {
                case 1:
                domLine = drawLine(this.$refs['overallBusiness'], this.$refs['overallHost']);//, {x: 41, y: 50}
                break;
                case 2:
                domLine = drawLine(this.$refs['overallBusiness'], this.$refs['overallNet']);
                break;
                case 3:
                domLine = drawLine(this.$refs['overallBusiness'], this.$refs['overallDB']); //, {x: 38, y: 49}
                break;
                case 4:
                domLine = drawLine(this.$refs['overallBusiness'], this.$refs['overallMiddle']);
                break;
            }
            return domLine;
        }
    }
}
</script>
<style lang="scss" scoped>
.business-right{
    height: 100%;
    display: flex;
    flex-direction: column;
}
.overall-box{
    display: flex;
    flex-direction: row;
    height: 100%;
    p{
        color: #2D856C;
        font-size: 16px;
    }
    ul {
        color: #555555;
        font-size: 11px;
        li {
            text-align: center;
            line-height: 24px;
            span{
                font-size: 16px;
                color: #2D856C;
            }
        }
    }
    .overall-left{
        width: 100px;
        height: 100%;
        line-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .overall-business{
            background-image: url(@/assets/overall-business.svg);
            background-repeat: no-repeat;
            width: 96px;
            height: 292px;
            box-shadow: 0px 4px 10px 0px rgba(3,104,104,0.22);
            position: relative;
            z-index: 1;
            p {
                width: 18px;
                line-height: 24px;
                margin: 87px 0 16px 40px;
            }
        }
    }
    .overall-line{
        flex: 1;
        height: 100%;
    }
    .overall-right{
        width: 213px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .overall-item{
            width: 213px;
            height: 63px;
            background-repeat: no-repeat;
            padding-left: 73px;
            box-shadow: 0px 4px 10px 0px rgba(3,104,104,0.22);
            position: relative;
            z-index: 1;
        }
        .overall-host{
            background-image: url(@/assets/overall-host.svg);
        }
        .overall-net{
            background-image: url(@/assets/overall-net.svg);
        }
        .overall-database{
            background-image: url(@/assets/overall-database.svg);
        }
        .overall-middle{
            background-image: url(@/assets/overall-middle.svg);
        }
        p{
            padding-top: 8px;
        }
        ul {
            li {
                display: inline-block;
                margin-right: 8px;
            }
        }
    }
}
// .line2::after{
//     content: '';
//     display: block;
//     position: absolute;
//     top: 40px;
//     left: 24px;
//     width: 60px;
//     height: 60px;
//     border-width: 1px;
//     border-style: solid;
//     border-color: #BFCBD1 transparent transparent  transparent;
//     border-radius: 57px 50%/120px 0 0;
// }
// .line3::after{
//     content: '';
//     display: block;
//     position: absolute;
//     top: -10px;
//     left: 24px;
//     width: 60px;
//     height: 60px;
//     border-width: 1px;
//     border-style: solid;
//     border-color: #BFCBD1 transparent transparent transparent ;
//     border-radius: 60px 50%/120px 0 0;
//     transform: rotateX(180deg);
// }
// .line4::after{
//     content: '';
//     display: block;
//     position: absolute;
//     top: 0px;
//     left: 24px;
//     width: 60px;
//     height: 60px;
//     border-width: 1px;
//     border-style: solid;
//     border-color: #BFCBD1 transparent transparent  transparent;
//     border-radius: 60px 50%/120px 0 0;
//     transform: rotateX(180deg);
// }
</style>
<style>
.line-connect {
    position: fixed;
    background: #BFCBD1;
    height: 1px;
    z-index: 0;
}
.line-svg{
    background-image: url(@/assets/line.svg);
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    position: relative;
    left: -3px;
}
/* .line-append{
    content: '';
    display: block;
    position: relative;
    top: 0px;
    left: calc(100% - 15px);
    width: 30px;
    height: 30px;
    border-width: 1px;
    border-style: solid;
    border-color: #BFCBD1 transparent transparent  transparent;
    border-radius: 0 30px 50%/30px 30px 0;
} */
</style>