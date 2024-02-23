<template>
    <div class="tomcat-right">
        <div class="flex-1 large-card">
            <p class="large-sub-label">线程</p>
            <LineMultipleChart unit="个" domId="lineCode" v-if="threadList.length" :seriesData="threadList" height="100%"> </LineMultipleChart>
        </div>
        <div class="flex-1 large-card">
            <p class="large-sub-label">连接数</p>
            <LineChart domId="lineHeapMemoryUsage" :units="['个']" :legend="['连接数']" :seriesData1="listData" height="100%"> </LineChart>
        </div>
        <!-- <div class="flex-1 large-card">
            <p class="large-sub-label">告警</p>
            <WarnList style="flex:1; min-height: 0;" :businessId="searchId" :monitorTypeId="3" :searchData="searchWarn" refresh :showTop="false" :showFilter="false" :showIcon="true"></WarnList>
        </div> -->
    </div>
</template>
<script>
import ApiHost from '@/api/host';
export default {
    name: 'tomcatRight',
    props: {
        listData: {
            type: Array,
            default: () => {
                return []
            }
        },
        threadList: {
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
        LineMultipleChart: () => import('../../components/lineMultiple.vue'),
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
.tomcat-right{
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 16px;
}
</style>