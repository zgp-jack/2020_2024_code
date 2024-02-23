<template>
    <div class="table-panel">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="">
                <el-input v-model="formInline.name" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="common-btn" @click="handleSearch">查询</div>
                <div class="common-btn" @click="handleAdd">新增</div>
            </el-form-item>
        </el-form>
        <div class="main-box">
            <el-table :data="tableData" style="height: calc( 100% - 48px);">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="name" label="角色名称"> </el-table-column>
                <el-table-column prop="code" label="角色编码"> </el-table-column>
                <el-table-column prop="description" label="描述"> </el-table-column>
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
import ApiRole from '@/api/role';
export default {
    name: 'listable',
    data() {
        return {
            formInline: {
                name: '',
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
            this.getList();
        },
        getList() {
            let params = {
                keyword: this.formInline.name,
                page: this.currentPage,
                pageSize: this.pageSize,
            }
            ApiRole.listPage(params).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.total = data.total;
                    this.tableData = data.records.map(item => {
                        return item;
                    });
                }
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList();
        },
        handleSizeChange: function(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.getList();
        },
        handleAdd() {
            this.$emit('handleFunc', {type: 'add'});
        },
        handleEdit(row) {
            this.$emit('handleFunc', {type: 'edit', value: row});
        },
        handleDelete(row) {
            this.$confirm('确认删除该角色?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ApiRole.del({id: row.id}).then(res => {
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