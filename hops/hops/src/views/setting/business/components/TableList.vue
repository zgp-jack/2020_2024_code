<template>
    <div class="table-panel">
        <div class="main-box">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="formInline.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="common-btn" @click="handleSearch">查询</div>
                    <div class="common-btn" @click="handleAdd">新增</div>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" style="height: calc( 100% - 104px);" @sort-change="handleSortChange">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="name" label="业务名称"></el-table-column>
                <el-table-column prop="hostNumber" label="主机" sortable>
                    <template slot-scope="scope">
                        <span @click="openSetDialog('host')">{{ scope.row.hostNumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="dbNumber" label="数据库" sortable>
                    <template slot-scope="scope">
                        <span @click="openSetDialog('database')">{{ scope.row.dbNumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="middlewareNumber" label="中间件" sortable>
                    <template slot-scope="scope">
                        <span @click="openSetDialog('middleware')">{{ scope.row.middlewareNumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="networkNumber" label="网络" sortable>
                    <template slot-scope="scope">
                        <span @click="openSetDialog('net')">{{ scope.row.networkNumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="操作">
                    <template slot-scope="scope">
                        <div class="common-btn" @click="handleEdit(scope.row)">修改</div>
                        <div class="common-btn" @click="handleDelete(scope.row)">删除</div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="float: right; margin-top: 16px;"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="sizes,total,prev, pager, next, jumper"
                @size-change="handleSizeChange" 
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import ApiBusiness from '@/api/business';
export default {
    name: 'listable',
    data() {
        return {
            formInline: {
                name: ''
            },
            tableData: [],
            pageSize: 20,
            currentPage: 1,
            total: 0
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        handleSearch() {
			this.currentPage = 1;
			this.getList()
		},
        handleSortChange(obj) {
            this.formInline['field'] = obj.prop;
            if(obj.order == "ascending") {
                this.formInline.sort = 'asc';
            }else if(obj.order == "descending") {
                this.formInline.sort = 'desc';
            }else{
                this.formInline.sort = undefined;
                this.formInline.field = undefined;
            }
			this.currentPage = 1;
            this.getList();
		},
        getList() {
            let params = {
                ...this.formInline,
                page: this.currentPage,
                pageSize: this.pageSize,
            }
            ApiBusiness.page(params).then(res => {
                console.log(res);
                if(res.status === 1) {
                    const data = res.data;
                    this.total = data.total;
                    this.tableData = data.records.map(item => {
                        // item.rowHostList = item.serviceAssocInfoList.filter(info => info.type === 1);
                        // item.rowNetList = item.serviceAssocInfoList.filter(info => info.type === 2);
                        // item.rowDBList = item.serviceAssocInfoList.filter(info => info.type === 3);
                        // item.rowMiddleList = item.serviceAssocInfoList.filter(info => info.type === 4);
                        item.hostNumber = item.hostNumber//(item.hostIdList || []).length;
                        item.networkNumber = item.networkNumber //(item.networkIdList || []).length;
                        item.dbNumber = item.dbNumber //(item.dbIdList || []).length;
                        item.middlewareNumber = item.middlewareNumber //(item.middlewareIdList || []).length;
                        return item;
                    });
                }
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange: function(val) {
            this.currentPage = 1
            this.pageSize = val
            this.getList()
        },
        handleAdd() {
            this.$emit('handleFunc', {type: 'add'});
        },
        handleEdit(row) {
            this.$emit('handleFunc', {type: 'edit', value: row});
        },
        handleDelete(row) {
            this.$confirm('确认删除该业务?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ApiBusiness.del({id: row.id}).then(res => {
                    if(res.status) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getList();
                    }
                })
            }).catch(() => {  
            });
        },
        openSetDialog(key) {
            switch (key) {
                case 'host':
                    
                    break;
            
                default: break;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.table-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-box{
        flex: 1;
    }
}
</style>