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
        <el-input
          @clear="getAllUsers()"
          clearable
          class="searchInput"
          placeholder="请输入内容"
          v-model="query"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="success" @click="showDiaAddUser()">添加按钮</el-button>
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

      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scop.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="showDiaEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showMsgBoxDele(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showDiaSetRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="  pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 对话框 - 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框-分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">{{formdata.username}}</el-form-item>
        <el-form-item label="角色">
          <!-- 下拉框的角色 -->
          {{selectVal}}
          <el-select v-model="selectVal" placeholder="请选择角色名">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <!-- 5个角色此时都有了自己的value值
             [30,31,34,39,40]
            value就是角色id-->
            <el-option
              v-for="(item,i) in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
            <!-- （动态）将来获取角色名数据 v-for遍历 -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      //表格数据
      list: [],
      //关闭对话框
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      //表单数据-> 将来发送post请求->请求体
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 角色分配下拉框的数据
      selectVal: 1,
      currUserId: -1,
      //角色数组
      roles: []
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
    //分配角色 发送请求
    async setRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.selectVal
      });
      console.log(this.currUserId)
        console.log(this.selectVal)
      console.log(res);
      
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //关闭对话框
        this.dialogFormVisibleRole =false; 
      }
    },
    //分配角色 - 打开对话框
    async showDiaSetRole(user) {
      // this.currUsername = user.username;
      this.formdata = user;
      this.currUserId = user.id;
      this.dialogFormVisibleRole = true;

      //获取角色名称
      const res = await this.$http.get(`roles`);
      this.roles = res.data.data;
      //给下拉框V-model绑定的selectVal赋值
      const res2 = await this.$http.get(`users/${user.id}`);
      this.selectVal = res2.data.data.rid;
    },
    //修改状态(绿红)
    async changeState(user) {
      //uId是用户id type  - 用户user 所以要先拿到user
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    //编辑 - 发送请求
    async editUser() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );

      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //关闭对话框
        this.dialogFormVisibleEdit = false;
        //更新表格
        this.getTableData();
      }
    },
    //编辑 - 显示对话框
    showDiaEditUser(user) {
      //获取当前用户数据
      this.formdata = user;

      this.dialogFormVisibleEdit = true;
    },
    //删除 -显示确认框
    //点击确定 来到.then 点击取消 来到 .catch
    showMsgBoxDele(user) {
      this.$confirm("是否把我删掉?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData();
          }
          this.$message.success("删除成功");
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {
          this.$message.info("取消删除");
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    //添加-发送请求
    async addUser() {
      //发送请求 获取表单数据
      const res = await this.$http.post(`users`, this.formdata);
      //关闭对话框
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        //关闭对话框
        this.dialogFormVisibleAdd = false;
        //更新表格
        this.getTableData();
      }
    },
    //添加用户中的打开对话框 【点击按钮-改bool】
    showDiaAddUser() {
      this.dialogFormVisibleAdd = true;
      //清空
      this.formdata = {};
    },
    //清空时获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    //搜索用户
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    //分页相关的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
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
      console.log(res); //没有数据，此时看接口文档有没有其他数据
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
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
.page {
  margin-top: 20px;
}
</style>
