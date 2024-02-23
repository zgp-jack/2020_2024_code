<template>
    <div class="table-panel">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="">
                <el-input v-model="formInline.keyword" placeholder="用户名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="">
                <el-cascader
                    placeholder="所属单位"
                    v-model="formInline.companyIdList"
                    :options="companyTree"
                    :props="{ multiple: true, checkStrictly: true }"
                    clearable></el-cascader>
            </el-form-item> -->
            <el-form-item>
                <div class="common-btn" @click="handleSearch">查询</div>
                <div class="common-btn" @click="handleAdd">新增</div>
            </el-form-item>
        </el-form>
        <div class="main-box">
            <el-table :data="tableData" height="calc( 100% - 48px)">
                <el-table-column type="index" label="序号" width="120"> </el-table-column>
                <el-table-column prop="username" label="用户名称"> </el-table-column>
                <!-- <el-table-column prop="companyName" label="所属单位"> </el-table-column> -->
                <el-table-column prop="roleName" label="角色"> </el-table-column>
                <el-table-column prop="type" label="操作" width="200">
                    <template slot-scope="scope">
                        <div class="common-btn" @click="handleEdit(scope.row)">修改</div>
                        <div class="common-btn" @click="handleEditPwd(scope.row)">修改密码</div>
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
import { mapState } from 'vuex';
import ApiUser from '@/api/user';
export default {
    name: 'listable',
    data() {
        return {
            formInline: {
                keyword: '',
            },
            tableData: [],
            pageSize: 20,
            currentPage: 1,
            total: 0
        }
    },
    computed: {
        ...mapState({
            // companyTree: state => state.companyTree
        })
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
            const params = {
                page: this.currentPage,
                pageSize: this.pageSize,
                ...this.formInline
            }
            ApiUser.listPage(params).then(res => {
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
        handleEditPwd(row) {
            this.$prompt('新密码', '修改密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputType: 'password',
                inputErrorMessage: '修改密码格式不正确'
            }).then(({ value }) => {
                const params = {
                    id: row.id,
                    password: value //this.$md5(value + '/~!@#$%^&*+web+')
                }
                ApiUser.resetPwd(params).then(res => {
                    if(res.status) {
                        this.$message({
                            message: '修改密码成功',
                            type: 'success'
                        });
                        this.getList();
                    }
                })
            }).catch(() => {

            });
        },
        handleDelete(row) {
            this.$confirm('确认删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ApiUser.del({id: row.id}).then(res => {
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
    .main-box{
        height: calc( 100% - 56px);
    }
}
</style>