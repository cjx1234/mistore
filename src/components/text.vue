<template>
    <div>
          <!-- 添加地址表单 -->
          <el-form ref="add_address" :model="add_address" label-width="120px">
              <h5>{{add_address.title}}</h5>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="add_address.name" ></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="tel">
                <el-input v-model="add_address.tel" ></el-input>
              </el-form-item>
              <el-form-item label="省市区" prop="selectedOptions">
                <el-cascader  :options='options' v-model='add_address.selectedOptions' @change='addressChange'></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址" prop="detailaddress">
                <el-input v-model="add_address.detailaddress" ></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="onSubmit">保存</el-button>
                  <el-button @click="clear('add_address')">取消</el-button>
                  <!-- 传值字符串，如果外面是双引号，里面单引号，不可都写双引号 -->
              </el-form-item>
          </el-form>
          
          <!-- 下面是地址列表： -->
          <h5>地址列表</h5>
          <div v-for="(item,index) in address_list" :key='index' class="addresslist">
              <el-descriptions
                :column="4"
                :size="size"
                direction="vertical"
                :style="blockMargin"
              >
                <el-descriptions-item label="姓名">{{item.name}}</el-descriptions-item>
                <el-descriptions-item label="电话">{{item.tel}}</el-descriptions-item>
                <el-descriptions-item :span="2">
                      {{item.default1}}
                </el-descriptions-item>
                <el-descriptions-item label="收货地址">
                      {{item.addressText}}{{item.detailaddress}}
                </el-descriptions-item>
                <el-descriptions-item>
                      <el-button type="primary" @click="edit_address(index)">编辑</el-button>
                      <el-button @click="del(index)">删除</el-button>
                      <el-button>
                          <em class="Default" v-if="item.isDefault">默认地址</em>
                          <em  v-else @click="setDefault(index)">设为默认</em>	
                      </el-button>
                      
                </el-descriptions-item>		
              </el-descriptions>
          </div>
            
  </div>
  </template>
  <script>
      // 引入表单
  import { reactive } from 'vue'
  //引入省市区
  import { regionData, CodeToText } from 'element-china-area-data'	
  
    export default{
      name:"addresslist",
      data(){
        return{
          address_list:[],
          add_address:{
            title:'添加地址',
            name:'',
            tel:'',
            // selectedOptions: "请选择", //选择区域
            selectedOptions:['110000', '110100', '110101'],  //或者这里给一个默认省市区
            addressText:'北京市市辖区东城区',   //省市区，另设addressText显示。
            detailaddress:'',
            isDefault:"", //此地址是否默认  
            addr_id:null//作为点击保存时，是添加还是编辑的标识  null添加  非null编辑
          },
          options: regionData,
          
              
        }
      },
     
      created(){
        //如果没有user，去登陆
        if(!window.localStorage.getItem("user")){
            this.$router.push({path:'/gologin'})
        }
        //进页面先查看缓存有没有address_list
        if(window.localStorage.getItem("addresslist")){
            //拉取到data
            console.log(window.localStorage.getItem("addresslist"))
            this.address_list=JSON.parse(localStorage.getItem("addresslist"))
          
        }
      },
      methods:{
          //省市区函数
          addressChange (arr) {
              // 此句为el-cascader的值 
              var addressText=CodeToText[arr[0]]+CodeToText[arr[1]]+CodeToText[arr[2]]
              console.log(addressText)
              this.add_address.addressText=addressText
              
             },
          //清空表单
          clear(formname){
              this.$refs[formname].resetFields(); //此时传值应是字符串  this.clear("add_address")
          },
          
          
          // 添加新地址   
         onSubmit(){
             console.log("--------"+this.add_address.addr_id)
            //如果id值为空，就是添加，不为空就是编辑
            if(this.add_address.addr_id==null){
              var copy_add=JSON.parse(JSON.stringify(this.add_address))//复制obj 表单
              this.address_list.push(copy_add);//添加进列表
                // 添加完了初始化 /清空表单
              this.clear("add_address")
              //保存进缓存
              localStorage.setItem("addresslist",JSON.stringify(this.address_list))
              
              
            }else{
                //点击上面的保存按钮
                //进入编辑地址,把值赋回列表
               console.log("我是编辑"+this.add_address.addr_id)
              var copy_edit=JSON.parse(JSON.stringify(this.add_address))
              copy_edit.title='添加地址'
              copy_edit.addr_id=null
              this.address_list[this.add_address.addr_id]=JSON.parse(JSON.stringify(copy_edit))
              console.log("------------edit--")
              console.log(this.address_list[this.add_address.addr_id])
                // 初始化
              this.clear("add_address")
              //保存进缓存
              localStorage.setItem("addresslist",JSON.stringify(this.address_list));
            }
         },
         
         //设置默认地址
         setDefault(index){
             for (var i = 0; i < this.address_list.length; i++) {
                 this.address_list[i].isDefault=i==index;
             }
             
             this.address_list.splice(0, 0,...this.address_list.splice(index, 1));//默认地址设在首位  ...展开运算符
          //保存进缓存
          localStorage.setItem("addresslist",JSON.stringify(this.address_list));
         },
         
         // 点击列表中每个地址的编辑时 
         edit_address(index){
           // 让渲染的add_address=此时选中的地址(index)  
          var copy_obj=JSON.parse(JSON.stringify(this.address_list[index]))//复制列表里此地址obj
          copy_obj.title=	'编辑地址'
          copy_obj.addr_id=index
          this.add_address=JSON.parse(JSON.stringify(copy_obj))
          console.log(this.add_address)
          console.log('下方编辑按钮'+this.add_address.addr_id)
         },
         
         del(index){
           this.address_list.splice(index,1)
           //保存进缓存
           localStorage.setItem("addresslist",JSON.stringify(this.address_list));
         }
       }
    }
  </script>
  
  <style scoped>
     .Default{
         color:orange
     }
     .addresslist{
         border-top:1px solid darkgray;
     }
     h5{
         text-align: left;
         font-weight: bold;
     }
         
      
  </style>
  
  