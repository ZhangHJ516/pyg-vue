import Vue from 'vue'
import Router from 'vue-router'
import {
  Message
} from 'element-ui';

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'

Vue.use(Router)
//实例化路由
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      },
      {
        name: 'rights',
        path: '/rights',
        component: Rights
      },
      {
        name: 'roles',
        path: 'roles',
        component: Roles
      }
      ]
    }, {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})



// 路由导航守卫(保安)
// 任何路由标识变化->来到路由配置->自动来到路由守卫->渲染组件

// to->要去的路由配置对象 (name)
// from->当前的路由配置对象 (name)
// next -> 方法 next()->让路由配置继续生效
router.beforeEach((to, from, next) => {
  // 如果要去的是login -> next()
  if (to.name === 'login') {
    next();
  } else {
    // 如果要去的不是login ->
    //  2.1 !token -> 去登录
    const token = localStorage.getItem("token");
    if (!token) {
      //提示
      // this.$message.warning("请先登录!");->
      Message.warning("请先登录!");

      //  this.$router.push({name:'login'})
      // $router
      router.push({
        name: 'login'
      })
      return;
    }
    //  2.2 token  -> next()
    next();



  }


  // console.log(to, from);

  // next方法



})

export default router;

