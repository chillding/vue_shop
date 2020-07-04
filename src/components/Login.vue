<template>
    <div class="login_container">
        <!-- 头像区域 -->
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <!-- 这里用到的ui要在/plugins/element.js中按需导入 -->
            <!-- ref表示组件的实例化对象 -->
            <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                            prefix-icon="el-icon-user"
                            v-model="loginForm.username"
                            placeholder="请输入用户名"
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input
                            prefix-icon="el-icon-lock"
                            v-model="loginForm.password"
                            type="password"
                            placeholder="请输入密码"
                    ></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="login_btn">
                    <el-button type="primary" @click="login('loginFormRef')" :loading="loading">登录</el-button>
                    <el-button type="info" @click="resetLoginForm('loginFormRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                // 这是登录表单的数据绑定对象
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                loginFormRules:{
                    // 验证用户名是否合法
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    // 验证密码是否合法
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                    ],
                },
                loading: false
            }
        },
        methods:{

            login(loginFormRef){

                this.loading = true
                // validate 对整个表单进行校验，
                // 它的回调函数(第一个形参是boolean,第二个形参是object)
                this.$refs[loginFormRef].validate(async (valid)=>{
                    if(!valid) return;
                    // { data: res }表示将data从res中解构出来
                    // 问题：{ data: res }提示data为undefined？
                    const { data: res } = await this.$http.post('login', this.loginForm).finally(()=>{
                        this.loading = false
                    })
                    if(res.meta.status != 200) return this.$message.error('登录失败')
                    this.$message.success("登录成功")
                    // 1、将登录成功之后的token保存到客户端的sessionStorage中
                    //     - 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                    //     - token只应在当前网站打开期间生效，所以讲token保存在sessionStorage中
                    console.log(res)
                    window.sessionStorage.setItem('token',res.data.token)
                    // 2、通过编程时导航跳转到后台主页，路由地址是/home
                    this.$router.push('/home')
                })
            },
            // 点击重置按钮，重置登录表单
            resetLoginForm(loginFormRef){
                // resetFields 对整个表单进行重置
                this.$refs[loginFormRef].resetFields();
            }
        }
    }
</script>

<style lang="less" scoped>
    /**
    * <style lang="less" scoped>
    * lang="less"表示支持less
    * 如果想用less，则需要npm install --save-dev less-loader less
    * 不然会报错：Can't resolve 'less-loader' in...
    * scoped表示样式生效区间
    * 这里表示只在样式组件内生效，如果去掉则全局生效
    */
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
        color: #fff;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 8px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .avatar_box{
        width: 130px;
        height: 130px;
        border-radius: 50%;
        border: 1px solid #ccc;
        position: absolute;
        left: 50%;
        top: 0px;
        transform: translate(-50%, -50%);
        padding: 10px;
        box-shadow: 0 0 10px #dddddd;
        background: #ffffff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #dddddd;
        }
    }
    .login_btn{
        display: flex;
        justify-content: flex-end;
    }
    .login_form{
        width: 100%;
        padding: 0 20px;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
    }
</style>