import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 注册为全局可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 把弹框组件挂载到了vue的message上，通过this.$message就可以访问到
Vue.prototype.$message = Message
