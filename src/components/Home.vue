<template>
    <el-container class="home-container">
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'256px'">
            <div id="logo" @click="linkHome" :style="isCollapse?'padding-left:16px':''">
                <img src="./../assets/logo.png">
                <h1 v-show="!isCollapse">CHILL电商后台管理系统</h1>
            </div>
            <el-menu
                    background-color="#001529"
                    text-color="#fff"
                    active-text-color="#2f54eb"
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :unique-opened="true"
                    :router="true">
                <!-- 一级菜单 -->
                <!-- :index只接受字符串，所以在后边拼一个空的字符串 -->
                <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                    <!-- 一级菜单模板区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-discover"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-position"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-container>
            <!-- Header -->
            <el-header>
                <div class="header">
                    <span :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="toggleCollapse"></span>
                    <button type="info" @click="loginOut">退出</button>
                </div>
            </el-header>
            <!-- Main -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
            <!-- Footer -->
            <el-footer>Copyright © 2020 chill, lnc.</el-footer>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return{
                menulist: [],
                isCollapse: false,
            }
        },
        created() {
            this.getMenuList()
        },
        methods: {
            loginOut() {
                // 清空token
                window.sessionStorage.removeItem('token')
                // 重定向到登录页
                this.$router.push('/login')
            },
            linkHome() {
                this.$router.push('/')
            },
            // 获取所有的菜单
            async getMenuList() {
                const { data: res } = await this.$http.get('menus')
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menulist = res.data
                console.log(this.menulist)
            },
            // 菜单的折叠与展开
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container{
        height: 100%;
    }
    .el-header{
        background-color: #ffffff ;
        height: 64px;
        line-height: 64px;
        padding: 0px;
        .header{
            position: relative;
            height: 64px;
            padding: 0;
            background: #fff;
            -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
            box-shadow: 0 1px 4px rgba(0,21,41,.08);
            span{
                padding: 19px 24px;
                font-size: 20px;
                cursor: pointer;
                -webkit-transition: all .3s,padding 0s;
                transition: all .3s,padding 0s;
            }
        }
    }
    .el-aside{
        background-color: #001529 ;
    }
    .el-footer{
        padding: 24px 50px;
        color: rgba(0,0,0,.65);
        font-size: 14px;
        background: #f0f2f5;
        text-align: center;
    }
    #logo{
        position: relative;
        height: 64px;
        padding-left: 24px;
        overflow: hidden;
        -webkit-transition: all .3s;
        transition: all .3s;
        line-height: 64px;
        background: #001529;
        cursor: pointer;
        img{
            width: 32px;
            height: 32px;
            vertical-align: middle;
            display: inline-block;
            float: left;
            margin-top: 16px;
        }
        h1{
            color: #fff;
            font-size: 16px;
            margin: 0 0 0 37px;
            font-weight: 600;
            vertical-align: middle;
            box-sizing: border-box;
            height: 64px;
        }
    }
    .el-menu{
        border-right: 0px;
    }
</style>