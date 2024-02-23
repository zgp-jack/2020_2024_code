<template>
    <div>
        <el-form :model="formData" :rules="rules" ref="formAddEdit">
            <el-form-item label="姓名" prop="userName" :label-width="formLabelWidth" v-if="type === 'edit'">
                <el-input disabled v-model="formData.userName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="userId" :label-width="formLabelWidth" v-if="type === 'add'">
				<el-cascader ref="cascader" v-model="formData.userId" placeholder="推送人员" :props="{ emitPath: false }" :options="wxUser" :show-all-levels="false" style="width: 100%;"></el-cascader>
            </el-form-item>
            <el-form-item label="主机" :label-width="formLabelWidth">
                <el-select v-model="formData.hostIdList" placeholder="请选择主机" multiple filterable>
                    <el-option v-for="item in hostList" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据库" :label-width="formLabelWidth">
                <el-select v-model="formData.dbIdList" placeholder="请选择数据库" multiple filterable>
                    <el-option v-for="item in dbList" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="中间件" :label-width="formLabelWidth">
                <el-select v-model="formData.middlewareIdList" placeholder="请选择中间件" multiple filterable>
                    <el-option v-for="item in midddleList" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="网络" :label-width="formLabelWidth">
                <el-select v-model="formData.networkIdList" placeholder="请选择网络" multiple filterable>
                    <el-option v-for="item in netList" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </div>
</template>
<script>
import ApiDatabase from '@/api/database';
import ApiHost from '@/api/host';
import ApiPush from '@/api/push';
import { getMiddleList, ApiNetwork } from '@/api/index';
import { mapState } from 'vuex';
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
                    

                }
            }
        }
    },
    data() {
        return {
            formData: {
                userId: '',
                userName: '',
                hostIdList: [],
                dbIdList: [],
                middlewareIdList: [],
                networkIdList:[]
            },
            formLabelWidth: '120px',
            rules: {
				userId: [{ required: true, message: '请选择推送人员', trigger: 'blur' }],
			},
            hostList: [],
            dbList: [],
            midddleList: [],
            netList: []
        }
    },
    mounted() {
        this.getHostList();
        this.getDBList();
        this.getMidddleList();
        this.getNetList();
        this.initData();
    },
    computed: {
		...mapState({
			wxUser: state => state.wxUser,
        })
	},
    methods: {
        initData() {
            if(this.type === 'edit') {
                this.formData.id = this.detailData['id'];
                this.formData.userId = this.detailData['userId'];
                this.formData.userName = this.detailData['userName'];
                this.formData.hostIdList = this.detailData['hostIdList'];
                this.formData.dbIdList = this.detailData['dbIdList'];
                this.formData.middlewareIdList = this.detailData['middlewareIdList'];
                this.formData.networkIdList = this.detailData['networkIdList'];
            }
        },
        getHostList() {
            ApiHost.page({page: 1, pageSize: 10000}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.hostList = data.records.map(item => {
                        return {
                            label: item.computerName,
                            value: item.id
                        }
                    });
                }
            })
        },
        getDBList() {
            ApiDatabase.page({page: 1, pageSize: 10000}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.dbList = data.records.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    });
                }
            })
        },
        getMidddleList() {
            getMiddleList({page: 1, pageSize: 10000}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.midddleList = data.records.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    });
                }
            })
        },
        getNetList() {
            ApiNetwork('page', {page: 1, pageSize: 10000}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.netList = data.records.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    });
                }
            })
        },
        submitForm() {
            if(this.type === 'add') {
                const node = this.$refs['cascader'].getCheckedNodes(true)[0];
                if(!!node) {
                    this.formData.userId = node.value;
                    this.formData.userName = node.label;
                }
            }
            this.$refs.formAddEdit.validate((valid) => {
				if (valid) {
                    ApiPush[this.type === 'edit' ? 'update' : 'save'](this.formData).then(res => {
                        if(res.status === 1) {
                            this.$emit('handleSubmit');
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }
            })
        },
        closeDialog() {
            this.$emit('handleClose');
        }
    }
}
</script>