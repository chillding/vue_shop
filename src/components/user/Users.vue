<template>
    <div>
        <!-- 面包屑导航 -->
        <div class="breadcrumb_main">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
            <h1>活动列表</h1>
            <p>这是一行介绍，这是一行介绍</p>
        </div>
        <div class="element_content">
            <div class="element_children_content">
                <el-card>
                    <el-row :gutter="20">
                        <el-col :span="7">
                            <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
                                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="userList" stripe style="width: 100%" border>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="username" label="姓名"></el-table-column>
                        <el-table-column prop="mobile" label="电话"></el-table-column>
                        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
                        <el-table-column prop="role_name" label="角色"></el-table-column>
                        <el-table-column label="状态">
                            <!-- 作用域插槽，scope.row可以获取该行数据 -->
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                                <el-button type="danger" size="small" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                                <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                                    <el-button type="warning" size="small" icon="el-icon-setting"></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="queryInfo.pagenum"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </el-card>
                <!-- 添加用户 -->
                <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClosed">
                    <el-form
                            :model="addForm"
                            :rules="addFormRules"
                            ref="addFormRef"
                            label-width="100px">
                        <!-- prop="username"：校验规则-->
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="addForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="addForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="mobile">
                            <el-input v-model="addForm.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer">
                        <el-button @click="addDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addUser">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- 修改用户 -->
                <el-dialog title="修改用户" :visible.sync="editDialogVisible"@close="editDialogClosed">
                    <el-form
                            :model="editForm"
                            :rules="editFormRules"
                            ref="editFormRef"
                            label-width="100px">
                        <!-- prop="username"：校验规则-->
                        <el-form-item label="用户名">
                            <el-input v-model="editForm.username" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="emil">
                            <el-input v-model="editForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="mobile">
                            <el-input v-model="editForm.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer">
                        <el-button @click="editDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="editUser">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            // 自定义校验邮箱的规则
            const checkEmail = (rule, value, cb) => {
                const regmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
                if (regmail.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }
            // 自定义校手机号的规则
            const checkMobile = (rule, value, cb) => {
                const regmobile = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
                if (regmobile.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的手机号码'))
            }
            return {
               queryInfo:{
                   query: '',
                   pagenum: 1,
                   pagesize: 10
               },
                userList: [],
                total:0,
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                    ],
                    email: [
                        // validator 自定义校验规则
                        { required:false, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail }
                    ],
                    mobile: [
                        { required:false, message: '请输入电话号码', trigger: 'blur' },
                        { validator: checkMobile }
                    ]
                },
                addFormRef:{},
                // 控制对话框显示和隐藏
                addDialogVisible: false,
                editDialogVisible: false,
                editForm:{},
                // 修改表单的验证规则
                editFormRules: {
                    email: [
                        // validator 自定义校验规则
                        { required:false, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail }
                    ],
                    mobile: [
                        { required:false, message: '请输入电话号码', trigger: 'blur' },
                        { validator: checkMobile }
                    ]
                },
                editFormRef:{},
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList(){
                const { data: res } = await this.$http.get('users', { params:this.queryInfo })
                if (res.meta.status != 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.userList = res.data.users
                this.total = res.data.total
                // console.log('getUserList', this.userList)
            },
            // 监听pagesize改变的事件
            handleSizeChange(newSize) {
                // console.log('newSize', newSize)
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            // 监听页码值改变的事件
            handleCurrentChange(newPage) {
                // console.log('newPage', newPage)
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            // 监听switch开关状态的变化
            async userStateChanged(userInfo) {
                // console.log('userInfo', userInfo)
                const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                if (res.meta.status != 200) {
                    return this.$message.error(res.meta.msg)
                    userInfo.mg_state = !userInfo.mg_state
                }
                this.$message.success('更新用户状态成功！')

            },
            // 监听添加用户对话框关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            // 添加用户
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return
                    const { data: res } = await this.$http.post('users', this.addForm)
                    if (res.meta.status != 201) {
                        return this.$message.error(res.meta.msg)
                    }
                    this.$message.success('添加用户成功！')
                    this.addDialogVisible = false
                    this.getUserList()
                })
            },
            async showEditDialog(id) {
                const { data: res } = await this.$http.get('users/' + id)
                if (res.meta.status != 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.editForm = res.data
                this.editDialogVisible = true
            },
            // 修改用户信息
            editUser() {
                this.$refs.editFormRef.validate(async valid => {
                    if(!valid) return
                    const { data: res } = await this.$http.put('users/' + this.editForm.id,
                        {email: this.editForm.email,mobile: this.editForm.mobile})
                    if (res.meta.status != 200) {
                        return this.$message.error(res.meta.msg)
                    }
                    this.$message.success('修改用户信息成功！')
                    this.editDialogVisible = false
                    this.getUserList()
                })
            },
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },
            // 删除
            async removeUserById(id) {
               const confirmResult =  await this.$confirm('确认删除该用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err =>err)
                // err => {return err}里面只有一个参数，所以{}可以去掉，因为{}去掉了，所以return可以省略err =>err
                console.log(confirmResult)
                if (confirmResult !== 'confirm'){
                    return this.$message.info('取消删除')
                }
                const { data: res } = await this.$http.delete('users/' + id)
                if (res.meta.status != 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success('删除用户成功！')
                this.getUserList()
            }
        }
    }
</script>

<style lang="less" scoped>
.el-table{
    margin-top: 12px;
}
.el-form{
    width: 80%;
}
</style>