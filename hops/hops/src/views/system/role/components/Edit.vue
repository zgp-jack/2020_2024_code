<template>
    <div>
        <el-form :model="formData" ref="formAddEdit" :rules="rules">
            <el-form-item label="角色名称" prop="name" :label-width="formLabelWidth">
                <el-input v-model="formData.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="编码" prop="code" :label-width="formLabelWidth">
                <el-input v-model="formData.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
                <el-input v-model="formData.description" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="permissionIds" :label-width="formLabelWidth">
                <el-select v-model="formData.permissionIds" placeholder="请选择权限">
                    <el-option v-for="item in permissions" :label="item.name" :value="item.id"></el-option>
                    <el-option label="iis" value="isIis"></el-option>
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
import { mapState } from 'vuex';
import ApiRole from '@/api/role';

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
                    name: '',
                    code: '',
                    description: '',
                    permissionIds: []
                }
            }
        }
    },
    computed: {
        ...mapState({
            permissions: state => state.permissions,
        })
    },
    data() {
        return {
            formData: {
                name: '',
                code: '',
                description: '',
                permissionIds: ''
            },
            formLabelWidth: '120px',
            rules: {
                name: [{ required: true, message: '角色名称不能为空', trigger: 'blur'}],
				permissionIds: [{ required: true, message: '请选择权限', trigger: 'change'}],
            }
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            if(this.type === 'edit') {
                this.formData.id = this.detailData['id'];
                this.formData.name = this.detailData['name'];
                this.formData.code = this.detailData['code'];
                this.formData.description = this.detailData['description'];
                this.formData.permissionIds = this.detailData['permissionIds'][0];
            }
        },
        submitForm() {
            this.$refs.formAddEdit.validate((valid) => {
				if (valid) {
                    const params = {
                        id: this.formData.id,
                        name: this.formData.name,
                        code: this.formData.code,
                        description: this.formData.description,
                        permissionIds: [this.formData.permissionIds],
                    }
                    ApiRole.save(params).then(res => {
                        if(res.status === 1) {
                            this.$emit('handleSubmit');
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