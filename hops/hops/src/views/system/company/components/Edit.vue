<template>
    <div>
        <el-form :model="formData">
            <el-form-item label="主机名称" :label-width="formLabelWidth">
                <el-input v-model="formData.computerName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="版本" :label-width="formLabelWidth">
                <el-input v-model="formData.systemName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="版本号" :label-width="formLabelWidth">
                <el-input v-model="formData.version" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="认证ID" :label-width="formLabelWidth">
                <el-input v-model="formData.authId" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="采集范围" :label-width="formLabelWidth">
                <el-select v-model="scopeCollection" placeholder="请选择采集范围" multiple>
                    <el-option label="基础信息" value="isBase"></el-option>
                    <el-option label="iis" value="isIis"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="位置" :label-width="formLabelWidth">
                <el-input v-model="formData.addr" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </div>
</template>
<script>
import ApiHost from '@/api/host';
export default {
    props: {
        type: {
            type: String,
            default: 'edit'
        },
        detailData: {
            type: Object,
            default: () => {
                return {
                    computerName: '',
                    systemName: '',
                    version: '',
                    authId: '',
                    addr: '',
                    isBase: 0,
                    isIis: 0
                }
            }
        }
    },
    data() {
        return {
            formData: {
                id: null,
                computerName: '',
                systemName: '',
                version: '',
                authId: '',
                addr: '',
                isBase: 0,
                isIis: 0
            },
            scopeCollection: [],
            formLabelWidth: '120px'
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            if(this.type === 'edit') {
                this.formData.id = this.detailData['id'];
                this.formData.computerName = this.detailData['computerName'];
                this.formData.systemName = this.detailData['systemName'];
                this.formData.version = this.detailData['version'];
                this.formData.authId = this.detailData['authId'];
                this.formData.addr = this.detailData['addr'];
                this.formData.isBase = this.detailData['isBase'];
                this.formData.isIis = this.detailData['isIis'];
                if(this.detailData['isBase'] === 1) {
                    this.scopeCollection.push('isBase')
                }
                if(this.detailData['isIis'] === 1) {
                    this.scopeCollection.push('isIis')
                }
            }
        },
        submitForm() {
            this.formData.isBase = this.scopeCollection.indexOf('isBase') >= 0 ? 1 : 0;
            this.formData.isIis = this.scopeCollection.indexOf('isIis') >= 0 ? 1 : 0;
            ApiHost[this.type === 'edit' ? 'update' : 'save'](this.formData).then(res => {
                console.log(res);
                if(res.status === 1) {
                    this.$emit('handleSubmit');
                }
            })
        },
        closeDialog() {
            this.$emit('handleClose');
        }
    }
}
</script>