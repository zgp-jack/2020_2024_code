<template>
    <div class="iis-right">
        <p class="large-label">虚拟目录</p>
        <div class="large-card flex-1">
            <IndexTable :tableHeader="tableHeader" :tableData="tableData"></IndexTable>
        </div>
        <!-- <p class="large-label">告警</p>
        <WarnList style="flex:1; min-height: 0;" :businessId="searchId" :monitorTypeId="3" :searchData="searchWarn" refresh :showTop="false" :showFilter="false" :showIcon="true"></WarnList> -->
    </div>
</template>
<script>
import { ApiNetworkList } from '@/api'
    export default {
        name: 'iisRight',
        props: {
            searchId: {
                type: Number
            },
            tableData: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        components: {
            WarnList: () => import('@/components/warnList.vue'),
            IndexTable: () => import('../../components/table.vue'),
        },
        data() {
            const endTime = parseInt(new Date().getTime())
            const startTime = endTime - 86400000;
            return {
                searchWarn: {
                    startTime: startTime,
                    endTime: endTime
                },
                tableHeader: [
                    { prop: 'physicalPath', label: '物理路径' },
                    { prop: 'vpath', label: '虚拟地址' },
                ],
            }
        },
        mounted() {
            
        },
        methods: {
            
        }
    }
</script>
<style lang="scss" scoped>
.iis-right{
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>