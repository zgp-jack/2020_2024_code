<template>
    <div class="business-left">
        <p class="large-label">基本情况</p>
        <div class="flex-1 large-card">
            <p class="large-sub-label">eden</p>
            <LineChart :units="['%']" :legend="['使用率']" domId="lineEden" v-if="jvmData.eden.length" :seriesData1="jvmData.eden" height="100%"> </LineChart>
        </div>
        <div class="flex-1 large-card">
            <p class="large-sub-label">survivor</p>
            <LineChart :units="['%']" :legend="['使用率']" domId="lineSurvivor" v-if="jvmData.survivor.length" :seriesData1="jvmData.survivor" height="100%"> </LineChart>
        </div>
        <div class="flex-1 large-card">
            <p class="large-sub-label">old</p>
            <LineChart :units="['%']" :legend="['使用率']" domId="lineOld" v-if="jvmData.old.length" :seriesData1="jvmData.old" height="100%"> </LineChart>
        </div>
    </div>
</template>
<script>
import { getMiddleList, listMiddle } from '@/api'
export default {
    name: 'middleJvmLeft',
    props: {
        searchId: {
            type: Number
        }
    },
    components: {
        LineChart: () => import('../../components/line.vue'),
    },
    data() {
        const endTime = new Date().getTime()
		const startTime = endTime - 86400000;
        return {
            seriesData1: [],
            jvmData: {
				old: [],
				eden: [],
				survivor: [],
				code: [],
				heapMemoryUsage: []
			},
            searchData: {
				startTime: startTime,
				endTime: endTime,
				name: '',
			},
            timer: null
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getList({monitorId: this.searchId,...this.searchData});
        this.timer = setInterval(() => {
            this.setTime();
            this.getList({monitorId: this.searchId,...this.searchData});
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
        getList(params) {
            this.jvmData = {
                old: [],
                eden: [],
                survivor: [],
                code: [],
                heapMemoryUsage: [],
            }
            listMiddle('list', params).then((res) => {
                if (res.status == 1) {
                    let jvmObject = res.data;
                    this.jvmData.old = jvmObject['old'];
                    this.jvmData.eden = jvmObject['eden'];
                    this.jvmData.survivor = jvmObject['survivor'];
                    this.jvmData.code = jvmObject['code'];
                    this.jvmData.heapMemoryUsage = jvmObject['heapMemoryUsage'];
                    this.$emit('setcodeList', jvmObject['code']);
                    this.$emit('setList', jvmObject['heapMemoryUsage']);
                }
            })
            getMiddleList({page: 1, pageSize: 9999, ...params}).then((res) => {
				if (res.status == 1 && res.data.records.length) {
					res.data.records.forEach((item) => {
						this.$store.state.ruleType.forEach((it) => {
							if (it.id == item.type) {
								item.typeName = it.typeName
							}
						})
					})
					const row = res.data.records.filter((item) => item.id === this.searchId)[0];
                    this.$emit('setTopInfo', {name: row.name, tip: row.typeName, ip: row.host});
				}
			})
        }
    },
    watch: {
        searchId: function(val) {
            this.getList({monitorId: val, ...this.searchData});
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