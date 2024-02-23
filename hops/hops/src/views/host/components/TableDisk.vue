<template>
    <div style="position: absolute;width: calc( 100% - 32px); height: calc( 100% - 70px);">
        <el-table :data="tableData" height="100%">
            <el-table-column prop="name" label="名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="type" label="文件类型" width="78"> </el-table-column>
            <el-table-column prop="rate" label="使用率(%)" width="96"> </el-table-column>
            <el-table-column prop="total" label="总容量(GB)" width="110" sortable :sort-method="(a, b) => {return a['total'] - b['total']}"> </el-table-column>
            <el-table-column prop="used" label="已用(GB)" width="96" sortable :sort-method="(a, b) => {return a['used'] - b['used']}"> </el-table-column>
            <el-table-column prop="free" label="剩余(GB)" width="96" sortable :sort-method="(a, b) => {return a['free'] - b['free']}"> </el-table-column>
            <el-table-column prop="usedDays" label="预估使用期(天)" width="110" align="center">
                <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.usedDays <= 0" class="item" effect="dark" content="采集数据量不足，暂无法预估" placement="top-start">
                        <div style="cursor: pointer; text-align: center;">--</div>
                    </el-tooltip>
                    <span v-else-if="scope.row.usedDays > 365">
                        一年以上
                    </span>
                    <span v-else>
                        {{ scope.row.usedDays }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import ApiHost from '@/api/host';
    import { getGb } from '@/utils/util'
    export default {
        props: {
            searchData: {
                type: Object
            }
        },
        data() {
            return {
                tableData: []
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                ApiHost.disk(this.searchData).then(result => {
                    // const result = res.data;
                    if(result.status == 1) {
                        this.tableData = result.data.map(item => {
                            item.total = getGb(item.total).num;
                            item.used = getGb(item.used).num;
                            item.free = getGb(item.free).num;
                            item.usedDays = (item.usedDays / 86400).toFixed(0);
                            return item;
                        });
                    }
                })
            }
        }   
    }
</script>