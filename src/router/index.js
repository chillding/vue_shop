import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component: Login
  },
  {
    path:'/home',
    component: Home,
    redirect: '/welcome',
    children:[
      {
        path:'/welcome',
        component: Welcome
      },
      {
        path:'/users',
        component:Users
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next)=>{
  const message = Message
  //  to 将要访问的路径
  //  from 从哪个路径跳转而来
  //  next 是一个函数，表示方形
  //    - next() 放行。next('/login') 强制跳转
  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token，强制跳转到登录页面
  if(!tokenStr){
    console.log(message)
    message.error('没有权限，请登录')
    return next('/login')
  }
  // 如果有token，进行下一步
  next()
})

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
