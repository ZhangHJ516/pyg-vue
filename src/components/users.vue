<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索+添加 -->
    <el-row class="seartBox">
      <el-col>
        <el-input class="searchInput" placeholder="请输入内容" v-model="query">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="success">成功按钮</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <!-- id: 502
     username: "linken"
     email: "123@qq.com"
     create_time: 1486720211
     mg_state: false
     mobile: "120"
    role_name: "测试角色2"-->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <!-- 处理日期格式 ->过滤器 2类（全局√和局部）+3步 
    过滤器fmtdate的使用
    1. v-bind:
    2.{{msg | fmtdate}}
      -->
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>

      <el-table-column prop="name" label="用户状态" width="140"></el-table-column>
      <el-table-column prop="name" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 10,
      //表格数据
      list: []
    };
  },
  //mounted(){}
  //获取首屏数据的方法调用
  //在发送请求之前，先设置请求头{Authorization:token值}
  //设置请求头headers->发送请求用的是axios->找axiosAPI有没有可以设置请求头->看文档
  created() {
    this.getTableData();
  },
  methods: {
    //获取表格数据
    async getTableData() {
      //除了登录之外的接口 都要授权
      const AUTH_TOKEN = localStorage.getItem("token"); //获取token
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //console.log(res); //没有数据，此时看接口文档有没有其他数据
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = data.users;
        console.log(this.list);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.seartBox {
  margin-top: 20px;
}
.searchInput {
  width: 350px;
}
</style>
