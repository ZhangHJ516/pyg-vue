<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
    <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning" show-icon></el-alert>
    <!-- 级联 -->
    <el-form :model="form" class="form" label-position="left" label-width="120px">
      <el-form-item label="请选择商品分类">
        {{selectedOptions}}
        <el-cascader
          clearable
          :show-all-levels="false"
          expand-trigger="hover"
          :options="options"
          :props="defaultProp"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!--注： selectedOptions:级联选择器绑定的数组 -->

    <!-- tabs -->
    <el-tabs @tab-click="changeTab()" v-model="actice" type="border-card">
      <el-tab-pane name="1" label="动态参数">
        <el-button disabled>设置动态参数</el-button>
        <el-table height="450px" border stripe :data="arrDy" style="width: 100%">
          <el-table-column type="expand" width="120">
            <template slot-scope="scope">
              <!-- 动态tag编辑 -->
              <el-tag
                :key="i"
                v-for="(item,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column type="index" label="#" width="120"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称"></el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

    <!-- 静态数据的表 -->
      <el-tab-pane name="2" label="静态参数">
        <el-button disabled>设置静态参数</el-button>
        <el-table height="350px" border stripe :data="arrStatic" style="width: 100%">
          <el-table-column type="index" label="#" width="120"></el-table-column>


          <el-table-column prop="attr_name" label="属性名称"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值"></el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      actice: "1",
      form: {},
      // 级联选择器的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
      },
      // 动态tag编辑需要的数据
      inputVisible: false,
      inputValue: "",
      // 动态数组
      arrDy: [],
      // 静态数组
      arrStatic: []
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 动态tag相关方法
    async handleClose(obj, item) {
      obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1);

      // 400->msg:参数 attr_sel 类型必须为 only 或 many
      // put修改->1.找到要修改的数据(分类id+attr_id)2.新数据(请求体)
      // 请求体:
      // {
      //   attr_name:"",
      //   attr_sel:"",
      //   attr_vals:""
      // }
      //【tag删除发送请求】
      //${this.selectedOptions[2]} id为2 选择的是三级数据 【2,3,6】
      //obj 属性
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}
        `,
        {
          //请求体
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          // 以,分割的属性值列表 [].join(",")
          attr_vals: obj.attr_vals.join(",")
        }
      );
      // console.log(res);
      //打印结果为400 -> 参数attr_sel 类型必须为only 或many 
      //put修改(删除tab)-> 找到要修改的数据通过(分类id+attr_id) 2.并增添新数据(请求体)
    },


  //编辑动态参数下的按钮  添加内容
  async handleInputConfirm(obj) {
      let inputValue = this.inputValue;
      if (inputValue) {
        //改数组 添加
        obj.attr_vals.push(inputValue);
        //发送请求
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}
        `,
          {
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            //把新数组传给后台 换成字符串 后台只识别字符串
            attr_vals: obj.attr_vals.join(",")
          }
        );
        console.log(res);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },


    // 【改变动态/静态 tab】
    changeTab() {
      //调用静态和动态数据的方法
      this.getDyOrStatic();
    },

    // 【显示的label一变化触发的方法 级联选择器】
    async handleChange() {
      //调用静态和动态数据的方法
      this.getDyOrStatic();
    },
    // 【获取动态or静态数据】
    async getDyOrStatic() {
      if (this.selectedOptions.length !== 3) {
        //提示消息
        this.$message.warning("请选择三级分类!!");
        //选择动态参数
        if (this.actice === "1") {
          //清空动态
          this.arrDy = [];
        }
        //选择静态参数
        if (this.actice === "2") {
          //清空静态
          this.arrStatic = [];
        }
        //【否则跳出当前代码块】
        return;
      }
      // 获取动态数组
      if (this.actice === "1") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        const {
          meta: { msg, status },
          data
        } = res.data;
        if (status === 200) {
          this.arrDy = data;
          this.arrDy.forEach(item => {
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
          console.log("动态参数数组--");
          console.log(this.arrDy);
        }
      }

    //获取静态数组
      if (this.actice === "2") {
        //发送请求
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        //解构赋值
        const {
          meta: { msg, status },
          data
        } = res.data;
        if (status === 200) {
          //给数组赋值
          this.arrStatic = data;
          console.log("静态参数数组--");
          console.log(this.arrStatic);
        }
      }
    },

    //级联数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}

/* tag标签样式 */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
