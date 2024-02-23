<template>
    <div class="dashboard-box">
        <div class="dashboard-legend">
            <div class="dashboard-legend-item" :style="{background: item.background}" v-for="item in legendList">
                <div class="dashboard-legend-icon" :style="{background: item.color}">
                    <i :class="item.icon"></i>
                </div>
                <div class="dashboard-legend-value" :style="{color: item.fontColor}">
                    <p>{{ item.label }}</p>
                    <span>{{ item.value }}</span>
                </div>
            </div>
        </div>
        <div class="dashboard-panel">
            <el-progress class="circle2" type="dashboard" :percentage="percentageValue.value" :show-text="false"></el-progress>
            <div class="dashboard-panel-label">
                <p class="dashboard-panel-label-value">{{ percentageValue.value }}℃</p>
                <p style="margin-top: 10px; color: #888;">{{ percentageValue.label }}</p>
            </div>
        </div>
        <progressColor style="width: 0;height: 0;"></progressColor>
    </div>
</template>
<script>
export default {
    components: {
        progressColor: () => import('@/components/progress-color.vue')
    },
    props: {
        legendList: {
            type: Array,
            default: () => {
                return [
                    {label: '当前利用率', value: '70%', icon: '', color: 'linear-gradient(180deg, #006666 0%, #cce0e0 100%)', background: 'rgba(0, 102, 102, 0.1)'},
                    {label: '当前负载', value: '0.5', icon: '', color: 'linear-gradient(180deg, #ffbc00 0%, #fff2cc 100%)', background: 'rgba(255, 188, 0, 0.1)'}
                ]
            }
        },
        percentageValue: {
            type: Object,
            default: () => {
                return {
                    value: 100,
                    label: '设备当前温度'
                }
            }
        }
    },
    data() {
        return {
            
        }
    }
}
</script>
<style lang="scss" scoped>
.dashboard-box{
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    .dashboard-legend{
        width: 152px;
        padding-top: 16px;
        .dashboard-legend-item{
            width: 152px;
            height: 40px;
            margin-bottom: 16px;
            border-radius: 4px;
            .dashboard-legend-icon{
                width: 40px;
                height: 40px;
                display: inline-block;
                line-height: 40px;
                text-align: center;
                border-radius: 4px;
                i{
                    font-size: 20px;
                    color: #f3f3f3;
                }
            }
            .dashboard-legend-value{
                display: inline-block;
                vertical-align: top;
                padding-left: 8px;
                p{
                    color: #799f9f;
                    text-align: left;
                    font-size: 12px;
                    font-weight: 400;
                }
                span{
                    font-size: 14px;
                }
            }
        }
    }
    .dashboard-panel{
        flex: 1;
        min-width: 0;
        text-align: right;
        position: relative;
        padding-right: 30px;
        .dashboard-panel-label {
            position: absolute;
            top: 56px;
            right: 30px;
            width: 126px;
            text-align: center;
            margin-top: -28px;
            color: #799f9f;
            font-size: 11px;
            z-index: 99;
            .dashboard-panel-label-value{
                color: #006666;
                font-size: 24px;
                line-height: 72px;
            }
        }
    }
}
.circle2{
    position: relative;
    z-index: 99;
}
.circle2::after {
    content: '';
    position: absolute;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    background-image: url(@/assets/pie-bg.svg);
    background-size: cover;
    left: -10px;
    top: -10px;
    z-index: -1;
    border-radius: 50%;
    box-shadow: 0px 4px 10px 0px rgba(3,104,104,0.22);
}
</style>
<style>
.circle2 .el-progress-circle svg > path:nth-child(2) {
    stroke: url(#green);
}
.el-progress-circle__track {
    stroke: #dde9e8;
}
</style>