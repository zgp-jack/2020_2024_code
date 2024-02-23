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
                <el-form-item style="float: right;">
                    <div class="common-btn" @click="handleDown">下载模板</div>
                    <el-upload :action="uploadUrl"
                        :show-file-list='false'
                        :on-success="handleUploadSuccess"
                        :on-error='handleUploadError'
                        :before-upload='handleUploadBefore'
                        :headers="myHeaders" 
                        accept=".xlsx,.xls"
                        style="display: inline-block;"
                        >
                        <div class="common-btn"><i class="pageImport-img"></i>导入</div>
                    </el-upload>
                    <div class="common-btn" @click="handleExport">导出</div>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" height="calc(100% - 104px)">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="name" label="名称" width="220" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="url" label="地址" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="typeStr" label="类型" width="180"> </el-table-column>
                <el-table-column prop="alarmNum" label="告警" width="180"> </el-table-column>
                <el-table-column prop="type" label="操作" width="220">
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
const RULETYPE = JSON.parse(sessionStorage.getItem('RuleType'))
import ApiDatabase from '@/api/database';
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
            total: 0,
            uploadUrl: '/api/dbConfig/importData',
			myHeaders: { token: sessionStorage.getItem('TOKEN') }
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
                name: this.formInline.name,
                page: this.currentPage,
                pageSize: this.pageSize,
            }
            ApiDatabase.page(params).then(res => {
                console.log(res);
                if(res.status === 1) {
                    const data = res.data;
                    this.total = data.total;
                    this.tableData = data.records.map(item => {
                        item.typeStr = RULETYPE.filter((r) => r.id === item.type)[0]['typeName']
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
            this.$confirm('确认删除该数据库?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ApiDatabase.del({dbId: row.id}).then(res => {
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
        handleDown() {
			ApiDatabase.downExportTemp({}).then(res => {
				if(res.status === 1) {
					window.open(`/file/${res.data}`);
				}
			})
		},
		handleExport() {
			let params = {
                name: this.formInline.name
            }
			ApiDatabase.exportData(params).then(res => {
				if(res.status === 1) {
					window.open(`/file/${res.data}`);
				}
			})
		},
		//上传相关
		handleUploadSuccess: function (response, file, fileList){
			if(response.status == 1){
				this.getList()
			} else{
			}
		}, 
		handleUploadError: function (err, file, fileList){
			console.log("返回错误内容：")
			console.log(err,file,fileList)
		},
		handleUploadBefore: function (file){
		},
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
        min-height: 0;
    }
}
</style>