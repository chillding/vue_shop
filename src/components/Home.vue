<template>
    <div>
        home
        <button type="info" @click="loginOut">退出</button>
    </div>
</template>

<script>
    export default {
        methods: {
            loginOut(){
                // 清空token
                window.sessionStorage.removeItem('token')
                // 重定向到登录页
                this.$router.push('/login')
            }
        }
    }
</script>

<style lang="less" scoped>

</style>