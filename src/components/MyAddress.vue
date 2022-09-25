<template>
  <div id="myAddress" class="section-address">
    <p class="title">收货地址</p>
    <div class="section-address">
      <div class="address-body">
        <ul>
          <!-- 地址列表 -->
          <li          
            v-for="(item, index) in address_list"
            :key="index"
            class="add-address"
            :class="index == choose ? 'in-section' : ''"           
            @mouseenter="enter(index)"
            @mouseleave="leave"
            @click="chooseAddress(index)"
          >
            <h2>{{ item.name }}</h2>
            <p class="phone">{{ item.tel }}</p>
            <p>
              {{ item.default1 }}
            </p>
            <p label="收货地址">
              {{ item.addressText }}
            </p>
            <!-- 设置移入显示编辑按钮 -->
            <div v-if="hoverShow && index == current" class="choose">
              <el-button
                type="primary"
                @click="
                  edit_address(index);
                  dialogVisible = true;
                "
                size="mini"
                >编辑</el-button
              >
                <el-button @click="del(index)" size="mini">删除</el-button>
            </div>
            <!-- 默认地址 -->
            <el-button size="mini" class="default-address">
              <em class="Default" v-if="item.isDefault">默认地址</em>
              <em v-else @click="setDefault(index)">设为默认</em>
            </el-button>
          </li>
          <!-- 新增地址列表 -->
          <li class="add-address">
            <el-button
              type="text"
              @click="
                dialogVisible = true;
                clear('add_address');
              "
              class="btn-newAddress"
            >
              <i class="el-icon-circle-plus-outline" style="font-size: 21px; color: orange;">新增地址</i>              
            </el-button>
            <!-- 新增地址弹层 -->
            <el-dialog :visible.sync="dialogVisible" width="50%" center>
              <!-- 添加地址表单 -->
              <el-form ref="add_address" label-width="120px">
                <h3 >{{ add_address.title }}</h3>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="add_address.name"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                  <el-input v-model="add_address.tel"></el-input>
                </el-form-item>
                <el-form-item label="省市区" prop="selectedOptions">
                  <el-cascader
                    :options="options"
                    v-model="add_address.selectedOptions"
                    @change="addressChange"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailaddress">
                  <el-input v-model="add_address.detailaddress"></el-input>
                </el-form-item>
              </el-form>
              <!-- 提交表单，并更新地址列表 -->
              <span slot="footer" class="dialog-footer">
                <el-button
                  @click="
                    dialogVisible = false;
                    clear('add_address');
                  "
                  >取 消</el-button
                >
                <el-button
                  type="primary"
                  @click="
                    dialogVisible = false;
                    onSubmit();
                  "
                  >保 存</el-button
                >
              </span>
            </el-dialog>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
//引入省市区
import { regionData, CodeToText } from "element-china-area-data";

export default {
  name: "MyAddress",
  data() {
    return {
      choose:0,//是否选择
      current: 0,//是否移入
      hoverShow: false,//移入展示
      dialogVisible: false,//弹层展示
      address_list: [],//地址列表
      confirmAddress: 1,//是否显示
      add_address: {
        title: "新增地址",
        name: "",
        tel: "",
        // selectedOptions: "请选择", //选择区域
        selectedOptions: ["福建省", "泉州市", "丰泽区"], //或者这里给一个默认省市区
        addressText: "北京市市辖区东城区", //省市区，另设addressText显示。
        detailaddress: "",
        isDefault: "", //此地址是否默认
        addr_id: null, //作为点击保存时，是添加还是编辑的标识  null添加  非null编辑
      },
      options: regionData,//配置省市三联动数据
    };
  },
  methods: {
    //省市区函数
    addressChange(arr) {
      // 此句为el-cascader的值
      var addressText =
        CodeToText[arr[0]] + CodeToText[arr[1]] + CodeToText[arr[2]];      
      this.add_address.addressText = addressText;
    },
    //清空表单
    clear(formname) {
      //调用nextTick获取渲染后的DOM进行表达重置
      this.$nextTick(()=>{
        this.$refs[formname].resetFields(); //此时传值应是字符串  this.clear("add_address") 
      })         
    },
    // 移入移出效果
    enter(index) {
      this.hoverShow = true;
      this.current = index;
    },
    leave() {
      this.hoverShow = false;
      this.current = false;
    },
    //选择是效果
    chooseAddress(index){
      this.choose=index
    },
    // 添加新地址
    onSubmit() {
      console.log(11);
      //如果id值为空，就是添加，不为空就是编辑
      if (this.add_address.addr_id == null) {
        var copy_add = JSON.parse(JSON.stringify(this.add_address)); //复制obj 表单
        this.address_list.push(copy_add); //添加进列表
        // 添加完了初始化 /清空表单
        this.clear("add_address");
        //保存进缓存
        localStorage.setItem("addresslist", JSON.stringify(this.address_list));
      } else {
        //点击上面的保存按钮
        //进入编辑地址,把值赋回列表
        console.log("我是编辑" + this.add_address.addr_id);
        var copy_edit = JSON.parse(JSON.stringify(this.add_address));
        copy_edit.title = "添加地址";
        copy_edit.addr_id = null;
        this.address_list[this.add_address.addr_id] = JSON.parse(
          JSON.stringify(copy_edit)
        );
        // 初始化
        this.clear("add_address");
        //保存进缓存
        localStorage.setItem("addresslist", JSON.stringify(this.address_list));
      }
    },
    //设置默认地址
    setDefault(index) {
      for (var i = 0; i < this.address_list.length; i++) {
        this.address_list[i].isDefault = i == index;
      }
      this.address_list.splice(0, 0, ...this.address_list.splice(index, 1)); //默认地址设在首位  ...展开运算符
      //保存进缓存
      localStorage.setItem("addresslist", JSON.stringify(this.address_list));
    },
    // 点击列表中每个地址的编辑时
    edit_address(index) {
      // 让渲染的add_address=此时选中的地址(index)
      var copy_obj = JSON.parse(JSON.stringify(this.address_list[index])); //复制列表里此地址obj
      copy_obj.title = "编辑地址";
      copy_obj.addr_id = index;
      this.add_address = JSON.parse(JSON.stringify(copy_obj));      
    },

    del(index) {
      this.address_list.splice(index, 1);
      //保存进缓存
      localStorage.setItem("addresslist", JSON.stringify(this.address_list));
    },
  },
  created() {
    //如果没有user，去登陆
    if (!window.localStorage.getItem("user")) {
      this.$router.push({ path: "/gologin" });
    }
    //进页面先查看缓存有没有address_list
    if (window.localStorage.getItem("addresslist")) {
      //拉取到data
      console.log(window.localStorage.getItem("addresslist"));
      this.address_list = JSON.parse(localStorage.getItem("addresslist"));
    }
  },
};
</script>
<style scoped>
/* 选择地址CSS */
.section-address {
  margin: 0 38px;
  overflow: hidden;
}
.section-address .title {
  color: #333;
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 20px;
}
.address-body li {
  float: left;
  color: #333;
  width: 195px;
  height: 178px;
  border: 1px solid #e0e0e0;
  padding: 15px 24px 0;
  margin-right: 17px;
  margin-bottom: 24px;
}
.address-body .in-section {
  border: 1px solid #ff6700;
}
.address-body li h2 {
  font-size: 18px;
  font-weight: normal;
  line-height: 30px;
  margin-bottom: 10px;
}
.address-body li p {
  font-size: 14px;
  color: #757575;
}
.address-body li .address {
  padding: 10px 0;
  max-width: 200px;
  max-height: 95px;
  line-height: 22px;
  overflow: hidden;
}
.add-address{
  position: relative;
}
.add-address .default-address{
  position: absolute;
  right: 0;
  top: 0px;
  border: none;
}
.add-address .choose{
  position: absolute;
  bottom: 25px;
  width: 180px;
  left: 50%;
  transform: translate(-50%);
}
.add-address .btn-newAddress{
  position: absolute;
  border: none;
  left: 50%;
  transform: translate(-50%);
  
}
.address-body .add-address {
  text-align: center;
  line-height: 30px;
}
.address-body .add-address i {
  font-size: 30px;
  padding-top: 50px;
  text-align: center;
}
.Default {
  color: orange;
}
/* 选择地址CSS END */
</style>