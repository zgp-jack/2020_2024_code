<template>
    <div>
        <el-form :model="formData" ref="formAddEdit" :rules="rules">
            <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId" :label-width="formLabelWidth">
                <el-select v-model="formData.roleId" placeholder="请选择角色">
                    <el-option v-for="item in roleList" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="电话号码" prop="phone" :label-width="formLabelWidth">
                <el-input v-model="formData.phone" autocomplete="off"></el-input>
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
import ApiUser from '@/api/user';
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
                    username: '',
                    companyId: 1,
                    roleId: '',
                    phone: '',
                }
            }
        }
    },
    computed: {
        ...mapState({
            roleList: state => state.roleList,
        })
    },
    data() {
        return {
            formData: {
                username: '',
                companyId: 1,
                roleId: '',
                phone: '',
            },
            formLabelWidth: '120px',
            companyId: [],
            rules: {
                username: [{ required: true, message: '用户名不能为空', trigger: 'blur'}],
				roleId: [{ required: true, message: '角色名不能为空', trigger: 'change'}],
				phone: [{ required: true, message: '手机号不能为空', trigger: 'blur'}],
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
                this.formData.username = this.detailData['username'];
                this.formData.companyId = this.detailData['companyId'];
                this.formData.roleId = this.detailData['roleId'];
                this.formData.phone = this.detailData['phone'];
            }
        },
        submitForm() {
            this.$refs.formAddEdit.validate((valid) => {
				if (valid) {
                    ApiUser.save(this.formData).then(res => {
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