<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-alert class="alert" title="添加商品信息" type="info" center show-icon></el-alert>

    <!-- 进度条 -->
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-form class="form" :model="form" label-position="top" label-width="80px">
      <el-tabs v-model="active" @tab-click="changeTab()" tab-position="left">
        <el-tab-pane label="基本信息">基本信息
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 表单元素 :级联选择器
            option:数据源
            selectedOptions：[]
            -->
            {{selectedOptions}}
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="4" label="商品图片">
          <!--
            1. action:服务器目录路径(全路径网址)
            2. headers{} 请求头
            3. :on-success fn
            4. :on-remove fn

            注意
            1. action全路径
            axiosAPI设置了baseURL->axios的请求不用写baseurl
            2. headers
            axios拦截器->config.headers[]=token->针对axios请求
          -->
          <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
       </el-tab-pane>

        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button @click="addGoods()">添加商品</el-button>
            <quill-editor class="quill" v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>



<script>
//富文本需要的导入
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";


export default {
    //富文本相关
     components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      //级联使用的数据
      options: [],
      defaultProp: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      selectedOptions: [],
      //复选框组
      // checklist:[],
      // 动态参数数组
      arrDy: [],
      // 静态数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //添加商品
   async addGoods(){
         // 1.处理goods_cat
      this.form.goods_cat = this.selectedOptions.join(",");
      // 2.this.form.pics -> 在图片上传方法中splice和push

      // 3. attrs [{attr_id:?,attr_value:?}]
      // 动态参数数组
      // 遍历
      // 返回数组
      // return {}

      const arr1 = this.arrDy.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // console.log(arr1);
      //
      // const obj1 = { attr_id: "", attr_value: "" };
      // const arr1 = [];
      // this.arrDy.forEach(item => {
      //   obj1.attr_id = item.attr_id;
      //   obj1.attr_value = item.attr_vals;
      //   arr1.push(obj1);
      // });
      // console.log(arr1);

     // 静态
      const arr2 = this.arrStatic.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // console.log(arr2);
      this.form.attrs = [...arr1, ...arr2];
      // console.log(this.form.attrs);

      const res = await this.$http.post(`goods`, this.form);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 201) {
        // 提示
        this.$message.success(msg);
        // 回到列表
        this.$router.push({
          name: "goods"
        });
      } else {
        console.log(msg);
      }
    },
    // 图片上传方法
    handleRemove(file, fileList) {
      // findIndex(ES6数组新增API)
      const Index = this.form.pics.findIndex(item => {
        // console.log(item);// item.pic
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(Index, 1);
      console.log(this.form.pics);
    },
    handleSuccess(response, file, fileList) {
      // response.data.tmp_path -> 临时路径

      this.form.pics.push({
        pic: response.data.tmp_path
      });
      console.log(this.form.pics);
    },
     handleSuccess(response, file, fileList) {
      // response.data.tmp_path -> 临时路径

      this.form.pics.push({
        pic: response.data.tmp_path
      });
      console.log(this.form.pics);
    },
    //点击任何tab都会
    async changeTab() {
      //如果点了第二个tab
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          // 提示
          this.$message.error("请先选择三级分类!");
          //
          if (this.active === "2") {
            this.arrDy = [];
          } else {
            this.arrStatic = [];
          }
          return;
        }

        //获取静态数组

        if (this.active === "3") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const {
            meta: { msg, status },
            data
          } = res.data;
          if (status === 200) {
            this.arrStatic = data;
            console.log("静态参数数组--");
            console.log(this.arrStatic);
          }
        }

        // 获取动态参数数据
        if (this.active === "2") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          const {
            meta: { msg, status },
            data
          } = res.data;
          if (status === 200) {
            this.arrDy = data;
            // console.log(this.arrDy);
            // this.arrDy中的attr_vals是字符串
            // "abc,def,efef" -> [abc,def,efef]
            this.arrDy.forEach(item => {
              //" a,b,c,d "
              //"" 空字符串
              //如果是空字符串 ->
              //如果不是空字符串-> split()
              //【 if(item.arr_vals.length === 0){
              //     item.arr_vals =[];
              // }else{
              //     item.arr_vals = item.attr_vals.trim().split(",");
              // } 】

              //"    "
              item.attr_vals =
                item.attr_vals.trim().length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
              console.log(item.attr_vals);
            });
            console.log("动态参数数组--");

            console.log(this.arrDy);
          }
        }
      }
    },
    //获取三级商品分类数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    },
    handleChange() {}
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
  height: 350px;
  overflow: auto;
}
.ql-editor,ql-blank{
    min-height:200px;
}

</style>
