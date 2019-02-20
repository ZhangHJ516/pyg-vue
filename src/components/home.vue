<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="图片加载失败">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout" @click="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
          :unique-opened="true"
          :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <!-- 1 -->
          <el-submenu :index="item1.order+''" v-for="(item1,i) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>

            <el-menu-item
              :index="item2.path+''"
              v-for="(item2,i) in item1.children"
              :key="item2.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>

          <!-- 2 -->
          <!-- <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
      
          <el-menu-item index="roles">
               <i class="el-icon-menu"></i>
            <span>角色列表</span>
          </el-menu-item>
           <el-menu-item index="rights">
               <i class="el-icon-menu"></i>
            <span>权限列表</span>
          </el-menu-item>
          </el-submenu>-->
          <!-- 3 -->
          <!-- <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template>
      
          <el-menu-item index="1-1">
               <i class="el-icon-menu"></i>
              商品列表
          </el-menu-item>
           <el-menu-item index="1-1">
               <i class="el-icon-menu"></i>
              分类参数
          </el-menu-item>
           <el-menu-item index="1-1">
               <i class="el-icon-menu"></i>
              商品分类
          </el-menu-item>

          </el-submenu>-->
          <!-- 4 -->
          <!-- <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>订单管理</span>
        </template>
      
          <el-menu-item index="1-1">
               <i class="el-icon-menu"></i>
             订单列表
              </el-menu-item>
          </el-submenu>-->
          <!-- 5 -->
          <!-- <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据统计</span>
        </template>
      
          <el-menu-item index="1-1">
            <i class="el-icon-menu"></i>
            数据报表
            </el-menu-item>
          </el-submenu>-->
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  //页面加载之前
  beforeMount() {
  
  },
  mounted() {
    console.log(111);
  },
  created() {
    this.getMenus();
  },
  methods: {
    //动态导航栏
    // 动态导航
    async getMenus() {
      // admin登录 -> 保存了后台返回的admin的主管角色的token
      // laowang38登录->保存了后台返回的laowang38的超级管理员角色的token

      const res = await this.$http.get(`menus`);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.menus = data;
      }
    },

    //退出
    handleLoginout() {
      //1.清除token
      localStorage.clear();
      //2.来到登录
      this.$router.push({
        name: "login"
      });
      //3.提示
      this.$message.warning("退出成功");
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  background-color: #b3c0d1;
}
.aside {
  background-color: yellow;
}
.main {
  /* background-color:green; */
}
.middle {
  line-height: 60px;
  text-align: center;
  color: #fff;
}
.logout {
  line-height: 60px;
  text-decoration: none;
}
</style>
