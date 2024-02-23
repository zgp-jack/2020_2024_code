<template>
    <div class="cache-right">
        <span class="large-label">最活跃线程</span>
        <div class="large-card flex-1">
            <IndexTable :tableHeader="tableHeader1" :tableData="threadList"></IndexTable>
        </div>
        <p class="large-label">即将到来的任务</p>
        <div class="large-card flex-1">
            <IndexTable style="margin-top: 8px;" :tableHeader="tableHeader" :tableData="taskList"></IndexTable>
        </div>
        <p class="large-label">可用空间</p>
        <div class="large-card flex-1">
            <el-table
                :data="diskList"
                style="width: 100%"
                current-change
                ref="diskList"
                highlight-current-row
                class="index-table"
                height="100%"
            >
                <el-table-column label="名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <p>{{ scope.row.name }}</p>
                        <span>{{ scope.row.directory }}</span><br/>
                        <span>最大空间：{{ scope.row.maxSize }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="大小" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <p>当前：{{ scope.row.size }}</p>
                        <span>拓展：{{ scope.row.expansionSize }}</span><br/>
                        <span>可用：{{ scope.row.available }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="磁盘/状态" show-overflow-tooltip width="100px">
                    <template slot-scope="scope">
                        <p>可用：{{ scope.row.diskFreeSpace }}</p>
                        <p>{{ scope.row.status }}</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <p class="large-label">告警</p>
        <WarnList style="flex:1; min-height: 0;" :businessId="searchId" :monitorTypeId="4" :searchData="searchWarn" refresh :showTop="false" :showFilter="false" :showIcon="true"></WarnList> -->
    </div>
</template>
<script>
import { ApiNetworkList } from '@/api'
    export default {
        name: 'databaseCacheRight',
        props: {
            taskList: {
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
            diskList: {
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
            IndexTable: () => import('../../components/table.vue'),
            WarnList: () => import('@/components/warnList.vue'),
        },
        data() {
            const endTime = new Date().getTime()
		    const startTime = endTime - 86400000;
            return {
                tab2Active: '1',
                tableHeader: [
                    {label: '任务', prop: 'taskName'},
                    {label: '时间', prop: 'taskTime'},
                    {label: '状态', prop: 'taskStatus'}
                ],
                tableHeader1: [
                    {label: '线程', prop: 'processId'},
                    {label: '执行代码行数', prop: 'lines'}
                ],
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
.cache-right{
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>