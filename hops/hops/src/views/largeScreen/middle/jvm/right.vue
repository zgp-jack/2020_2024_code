<template>
    <div class="jvm-right">
        <div class="flex-1 large-card">
            <p class="large-sub-label">code</p>
            <LineChart :units="['%']" :legend="['使用率']" domId="lineCode" v-if="codeList.length" :seriesData1="codeList" height="100%"> </LineChart>
        </div>
        <div class="flex-1 large-card">
            <p class="large-sub-label">heapMemoryUsage</p>
            <LineChart :units="['%']" :legend="['使用率']" domId="lineHeapMemoryUsage" :seriesData1="listData" height="100%"> </LineChart>
        </div>
        <!-- <p class="large-label">告警</p>
        <WarnList style="flex:1; min-height: 0;" :businessId="searchId" :monitorTypeId="3" :searchData="searchWarn" refresh :showTop="false" :showFilter="false" :showIcon="true"></WarnList> -->
    </div>
</template>
<script>
import ApiHost from '@/api/host';
export default {
    name: 'jvmRight',
    props: {
        listData: {
            type: Array,
            default: () => {
                return []
            }
        },
        codeList: {
            type: Array,
            default: () => {
                return []
            }
        },
        searchId: {
            type: Number
        }
    },
    components: {
        LineChart: () => import('../../components/line.vue'),
        WarnList: () => import('@/components/warnList.vue'),
    },
    data() {
        const endTime = parseInt(new Date().getTime())
		const startTime = endTime - 86400000;
        return {
            searchWarn: {
                startTime: startTime,
				endTime: endTime
            }
        }
    },
    mounted() {
        
    },
    methods: {
        
    }
}
</script>
<style lang="scss" scoped>
.jvm-right{
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 16px;
}
</style>