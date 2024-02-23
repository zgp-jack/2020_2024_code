<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="">
                <el-input v-model="formInline.user" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-input v-model="formInline.user" placeholder="版本"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="common-btn">查询</div>
                <div class="common-btn">新增</div>
            </el-form-item>
        </el-form>
        <div class="main-box">
            <el-table :data="tableData">
                <el-table-column prop="index" label="序号"> </el-table-column>
                <el-table-column prop="name" label="名称"> </el-table-column>
                <el-table-column prop="type" label="类型"> </el-table-column>
                <el-table-column prop="type" label="等级"> </el-table-column>
                <el-table-column prop="type" label="对象"> </el-table-column>
                <el-table-column prop="type" label="指标"> </el-table-column>
                <el-table-column prop="type" label="触发器"> </el-table-column>
                <el-table-column prop="type" label="触发窗口"> </el-table-column>
                <el-table-column prop="type" label="作用范围"> </el-table-column>
                <el-table-column prop="type" label="有效时间"> </el-table-column>
                <el-table-column prop="type" label="操作"> </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'listable',
        data() {
            return {
                formInline: {
                    user: '',
                    type: '1'
                },
                tableData: [
                    {name: 'C', type: 'NTFS', num: 99.99, day: 180}
                ]
            }
        },
        methods: {
            onSubmit() {

            }
        }
    }
</script>