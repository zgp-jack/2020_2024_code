<template>
    <div class="business-left">
        <p class="large-label">资源详情</p>
        <div class="flex-1">
            <div class="large-card" style="height: 33.34%;">
                <p class="large-sub-label">CPU概况</p>
                <DashboardView :legendList="legendList" :percentageValue="percentageValue"></DashboardView>
            </div>
            <div class="large-card" style="height: 33.34%;">
                <PieChart domId="pieMem" v-if="listMemSize.length" :seriesData="listMemSize" :legendList="legendMemList" height="100%">
                    <template v-slot:title>
                        <div>
                            <span class="large-sub-label">内存概况</span>
                        </div>
                    </template>
                </PieChart>
            </div>
            <div class="large-card" style="height: 33.33%;">
                <PieChart domId="pieDisk" v-if="listDiskSize.length" :seriesData="listDiskSize" :legendList="legendDiskList" height="100%">
                    <template v-slot:title>
                        <div>
                            <span class="large-sub-label">磁盘概况</span>
                        </div>
                    </template>
                </PieChart>
            </div>
        </div>
        
    </div>
</template>
<script>
import ApiHost from '@/api/host';
import { getGb } from '@/utils/util';
export default {
    name: 'businessLeft',
    props: {
        searchId: {
            type: Number
        }
    },
    components: {
        Bar: () => import('../components/bar.vue'),
        LineChart: () => import('../components/line.vue'),
        DashboardView: () => import('../components/dashboard.vue'),
        BarMountain: () => import('../components/barMountain.vue'),
        PieChart: () => import('../components/pie.vue'),
    },
    data() {
        const endTime = parseInt(new Date().getTime());
		const startTime = endTime - 86400000;
        return {
            tab1Active: '1',
            searchData: {
				hostId: 3,
				name: '',
				startTime: startTime,
				endTime: endTime,
			},
            listIdle: [],
            listTemperature: [],
            listMem: [],
            memRate: 0,
            listMemSize: [],
            legendMemList: [],
            listDisk: [],
            listDiskSize: [],
            legendDiskList: [],
            legendList: [
                {label: '当前利用率', value: '0', icon: 'iconfont icon-cpu', color: 'linear-gradient(180deg, #006666 0%, #cce0e0 100%)', background: 'rgba(0, 102, 102, 0.1)'},
                {label: '当前负载', value: '0', icon: 'iconfont icon-yibiaopan', color: 'linear-gradient(180deg, #ffbc00 0%, #fff2cc 100%)', background: 'rgba(255, 188, 0, 0.1)'}
            ],
            percentageValue: {
                value: 0,
                label: '设备当前温度'
            },
            timer: null
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getCpuData();
        this.getMemData();
        this.getDiskList();
        this.getBaseInfo();
        this.timer = setInterval(() => {
            this.setTime();
            this.getCpuData();
            this.getBaseInfo();
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
        getBaseInfo() {
            ApiHost.info(this.searchData).then(result => {
                if(result.status === 1) {
                    const data = result.data;
                    this.$emit('setTopInfo', {name: data.computerName, tip: data.manufacturer, ip: data.ip});
                }
            })
        },
        getCpuData() {
            this.listIdle = [];
            this.listTemperature = [];
            this.searchData.hostId = this.searchId;
            ApiHost.cpu(this.searchData).then(result => {
                // const result = res.data;
                if(result.status === 1) {
                    const list = result.data.cpuDataList || [];
                    
                    list.forEach(item => {
                        this.listIdle.push([item.time, item.idle]);
                        this.listTemperature.push([item.time, item.temperature]);
                    });
                }
                this.$emit('setListIdle', this.listIdle);
                this.$emit('setListTemperature', this.listTemperature);
                this.legendList[0].value = `${((result.data.idle || 0)).toFixed(0)}%`;
                this.legendList[1].value = result.data.load;
                this.percentageValue.value = result.data.temperature || 0;
            })
        },
        getMemData() {
            this.listMem = [];
            this.listMemSize = [];
            ApiHost.mem(this.searchData).then(result => {
                // const result = res.data;
                if(result.status === 1) {
                    const list = result.data.memDataList || [];
                    list.forEach(item => {
                        this.listMem.push([item.time, item.rate]);
                    });
                }
                this.memRate = ((result.data.rate || 0)).toFixed(0);
                this.$emit('setListMem', {list: this.listMem, data: this.memRate});
                // this.swapTotal = getGb(result.data.swapTotal).num;
                // this.swapUsed = getGb(result.data.swapTotal).num;
                // this.total = getGb(result.data.total).num;
                // this.used = getGb(result.data.used).num;
                const total = getGb(result.data.total).num;
                const used = getGb(result.data.used).num;
                const other = (total - used).toFixed(2);
                const swapTotal = getGb(result.data.swapTotal).num;
                const swapUsed = getGb(result.data.swapUsed).num;
                const swapOther = swapTotal - swapUsed;
                this.listMemSize = [
                    {label: '实际容量', value: total, unit: 'GB'},
                    {label: '实际容量', subLabel: '已使用', value: used, unit: 'GB'},
                    {label: '实际容量', subLabel: '剩余容量', value: other, unit: 'GB'},
                    {label: 'SWP容量', value: swapTotal, unit: 'GB'},
                    {label: 'SWP容量', subLabel: '已使用', value: swapUsed, unit: 'GB'},
                    {label: 'SWP容量', subLabel: '剩余容量', value: swapOther, unit: 'GB'},
                ]
                this.legendMemList = [
                    {label: '实际容量', value: total, used: used, other: other, unit: 'GB'},
                    {label: 'SWP容量', value: swapTotal, used: swapUsed, other: swapOther, unit: 'GB'},
                ]
            })
        },
        getDiskList() {
            this.listDisk = [];
            this.listDiskSize = [];
            this.searchData.hostId = this.searchId;
            ApiHost.disk(this.searchData).then(result => {
                // const result = res.data;
                if(result.status == 1) {
                    let total = 0;
                    let used = 0;
                    let free = 0;
                    this.listDisk = result.data.map(item => {
                        item.value = item.rate;
                        item.num = item.rate;
                        item.unit = '%';
                        total+=item.total;
                        used+=item.used;
                        free+=item.free;
                        return item;
                    });
                    this.$emit('setListDisk', this.listDisk);
                    total = getGb(total).num;
                    used = getGb(used).num;
                    free = getGb(free).num;
                    this.listDiskSize = [
                        {label: '实际容量', value: total, unit: 'GB'},
                        {label: '实际容量', subLabel: '已使用', value: used, unit: 'GB'},
                        {label: '实际容量', subLabel: '剩余容量', value: free, unit: 'GB'},
                    ]
                    this.legendDiskList = [
                        {label: '实际容量', value: total, used: used, other: free, unit: 'GB'},
                    ]
                }
            })
        },
    },
    watch: {
        searchId: function(val) {
            this.getCpuData();
            this.getBaseInfo();
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