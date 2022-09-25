<!--
 * @Description: 首页组件
 * @Author: hai-27
 * @Date: 2020-02-07 16:23:00
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-27 13:36:12
 -->
<template>
  <div class="home" id="home" name="home">
    <link rel="stylesheet" href="../assets/css/icon/iconfont.css">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel height="460px">
        <el-carousel-item v-for="item in carousel" :key="item.carousel_id">
          <img style="height:460px;" :src="$target + item.imgPath" :alt="item.describes" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 轮播图END -->
    <div class="main-box">
      <div class="main">
        <!-- 手机商品展示区域 -->
        <div class="phone">
          <div class="box-hd">
            <div class="title">手机</div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <router-link to>
                <img :src="$target +'public/imgs/phone/phone.png'" />
              </router-link>
            </div>
            <div class="list">
              <MyList :list="phoneList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 手机商品展示区域END -->

        <!-- 家电商品展示区域 -->
        <div class="appliance" id="promo-menu">
          <div class="box-hd">
            <div class="title">家电</div>
            <div class="more" id="more">
              <MyMenu :val="2" @fromChild="getChildMsg">
                <span slot="1">热门</span>
                <span slot="2">电视影音</span>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img :src="$target +'public/imgs/appliance/appliance-promo1.png'" />
                </li>
                <li>
                  <img :src="$target +'public/imgs/appliance/appliance-promo2.png'" />
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="applianceList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 家电商品展示区域END -->

        <!-- 配件商品展示区域 -->
        <div class="accessory" id="promo-menu">
          <div class="box-hd">
            <div class="title">配件</div>
            <div class="more" id="more">
              <MyMenu :val="3" @fromChild="getChildMsg2">
                <span slot="1">热门</span>
                <span slot="2">保护套</span>
                <span slot="3">充电器</span>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img :src="$target +'public/imgs/accessory/accessory-promo1.png'" alt />
                </li>
                <li>
                  <img :src="$target +'public/imgs/accessory/accessory-promo2.png'" alt />
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="accessoryList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 配件商品展示区域END -->
      </div>
    </div>
    <div class="home-bar">
        <a href="javascript:;" class="item item-img">
          <div class="icon">
            <span class="iconfont icon-shouji"></span>
          </div>
          <span class="text"> 手机APP </span>
          <div class="pop-content">
            <img
              src="../assets/imgs/78c30d4f259ed43ab20e810a522a6249.png"
              alt=""
            />
            <span class="desc">扫码领取新人百元礼包</span>
          </div>
        </a>
        <a href="javascript:;" class="item">
          <div class="icon">
            <span class="iconfont icon-gerenzhongxin"></span>
          </div>
          <span class="text"> 个人中心 </span>          
        </a>
        <a href="javascript:;" class="item">
          <div class="icon">
            <span class="iconfont icon-weixiubanshou"></span>
          </div>
          <span class="text"> 售后服务 </span>          
        </a>
        <a href="javascript:;" class="item">
          <div class="icon">
            <span class="iconfont icon-kefu"></span>
          </div>
          <span class="text"> 人工客服 </span>          
        </a>
        <router-link to="/shoppingCart" class="item">
          <div class="icon">
            <span class="iconfont icon-gouwuche"></span>
          </div>
          <span class="text"> 购物车 </span> 
          <span class="cart-num">{{getNum}}</span>         
        </router-link>
        <a href="javascript:;" class="item backtop " v-show="showBtn"  @click="toTop">  
            <div class="icon" >
              <span style="font-size: 30px" class="iconfont icon-Top"></span>
            </div>
            <span class="text">回顶部</span>
        </a>
    </div>
  </div>
  
</template>
<script>
  import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      carousel: "", // 轮播图数据
      phoneList: "", // 手机商品列表
      miTvList: "", // 小米电视商品列表
      applianceList: "", // 家电商品列表
      applianceHotList: "", //热门家电商品列表
      accessoryList: "", //配件商品列表
      accessoryHotList: "", //热门配件商品列表
      protectingShellList: "", // 保护套商品列表
      chargerList: "", //充电器商品列表
      applianceActive: 1, // 家电当前选中的商品分类
      accessoryActive: 1, // 配件当前选中的商品分类
      showBtn:false//是否展示回到顶部
    };
  },
  mounted(){
    window.addEventListener("scroll", this.showbtn, true);
  },
  watch: {
    // 家电当前选中的商品分类，响应不同的商品数据
    applianceActive: function(val) {
      // 页面初始化的时候把applianceHotList(热门家电商品列表)直接赋值给applianceList(家电商品列表)
      // 所以在切换商品列表时判断applianceHotList是否为空,为空则是第一次切换,把applianceList赋值给applianceHotList
      if (this.applianceHotList == "") {
        this.applianceHotList = this.applianceList;
      }
      if (val == 1) {
        // 1为热门商品
        this.applianceList = this.applianceHotList;
        return;
      }
      if (val == 2) {
        // 2为电视商品
        this.applianceList = this.miTvList;
        return;
      }
    },
    accessoryActive: function(val) {
      // 页面初始化的时候把accessoryHotList(热门配件商品列表)直接赋值给accessoryList(配件商品列表)
      // 所以在切换商品列表时判断accessoryHotList是否为空,为空则是第一次切换,把accessoryList赋值给accessoryHotList
      if (this.accessoryHotList == "") {
        this.accessoryHotList = this.accessoryList;
      }
      if (val == 1) {
        // 1为热门商品
        this.accessoryList = this.accessoryHotList;
        return;
      }
      if (val == 2) {
        // 2为保护套商品
        this.accessoryList = this.protectingShellList;
        return;
      }
      if (val == 3) {
        //3 为充电器商品
        this.accessoryList = this.chargerList;
        return;
      }
    }
  },
  created() {
    // 获取轮播图数据
    this.$axios
      .post("/api/resources/carousel", {})
      .then(res => {
        this.carousel = res.data.carousel;
      })
      .catch(err => {
        return Promise.reject(err);
      });
    // 获取各类商品数据
    this.getPromo("手机", "phoneList");
    this.getPromo("电视机", "miTvList");
    this.getPromo("保护套", "protectingShellList");
    this.getPromo("充电器", "chargerList");
    this.getPromo(
      ["电视机", "空调", "洗衣机"],
      "applianceList",
      "/api/product/getHotProduct"
    );
    this.getPromo(
      ["保护套", "保护膜", "充电器", "充电宝"],
      "accessoryList",
      "/api/product/getHotProduct"
    );
  },
  methods: {
    // 获取家电模块子组件传过来的数据
    getChildMsg(val) {
      this.applianceActive = val;
    },
    // 获取配件模块子组件传过来的数据
    getChildMsg2(val) {
      this.accessoryActive = val;
    },
    // 获取各类商品数据方法封装
    getPromo(categoryName, val, api) {
      api = api != undefined ? api : "/api/product/getPromoProduct";
      this.$axios
        .post(api, {
          categoryName
        })
        .then(res => {
          this[val] = res.data.Product;
          // console.log(res.data.Product)
        })
        .catch(err => {
          return Promise.reject(err);
        });
    },
    // 回到顶部
    showbtn() {
        let that = this;
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
          that.scrollTop = scrollTop;
        if (scrollTop > 640) {
            this.showBtn = true;
        } else {
            this.showBtn = false;
        }
      },
    toTop(){
      var timer = setInterval(function () {
          let osTop =
              document.documentElement.scrollTop || document.body.scrollTop;
          let ispeed = Math.floor(-osTop / 5);
          document.documentElement.scrollTop = document.body.scrollTop =
              osTop + ispeed;
          this.isTop = true;
          if (osTop === 0) {
              clearInterval(timer);
          }
        }, 30);
      },   
  },
  computed:{
    ...mapGetters(["getNum"]),
  }
};
</script>
<style scoped >
@import "../assets/css/index.css";
.home-bar{
  position: fixed;
  bottom: 70px;
  right: 0;
  z-index: 99;
}
.home-bar .item{
  position: relative;
  display: block;
  width: 82px;
  height: 90px;
  margin-top: -1px;
  background-color: #fff;
  border: 1px solid #f5f5f5;
  text-align: center;
}
.home-bar  a{
  color: #757575 ;
  
}
.home-bar a:hover{
  color: #ff6700;
}
.home-bar .item .icon{
  position: relative;
  width: 30px;
  height: 30px;
  margin: 0 auto 8px;
  padding-top: 18px;
}
.home-bar .item .icon span{
  font-size: 24px;
}
.home-bar .item-img {
  position: relative;
}
.item .pop-content{
  position: absolute;
  /* left: 0px; */
  top: 0;
  right: 0px;
  /* overflow: hidden; */
  margin-right: 100px;
  padding: 14px;
  background: #fff;
  border: 1px solid #f5f5f5;
  transition: opacity .3s;
  opacity: 0;
  transform: translateZ(0px); 
  visibility: hidden;
  
}
.item-img:hover .pop-content,.pop-content::after{
  opacity: 1;
  visibility: visible;
}
.home-bar .item .pop-content::before{
  right: -19px;
  border-color:rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #f5f5f5;
  z-index: 1;
}
.home-bar .item .pop-content::after,.home-bar .item .pop-content::before{
  content: "";
  position: absolute;
  top: 21%;  
  width: 0;
  height: 0;
  border-width: 10px;
  border-style: solid;
  overflow: hidden;
}
.home-bar .item .pop-content::after{
  right: -18px;
  border-color:rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #fff;
  z-index: 2;
}
.home-bar .item .pop-content img{
  display: block;
  width: 100px;
  height: 100px;
  margin: 6px auto;
}
.home-bar .item .pop-content .desc{
  display: block;
  width: 84px;
  margin: 14px auto 0;
  color: #757575;
  text-align: center;
}
.home-bar .item .cart-num{
  position: absolute;
  right: 14px;
  top: 18px;
  padding: 0 5px;
  height: 14px;
  line-height: 14px;
  color: #fff;
  font-size: 10px;
  background-color: #ff6700;
  border: 2px solid #fff;
  border-radius: 9px;
}
/* 回顶部 */
.home-bar .backtop{
  margin-top: 14px;
  border-top: 1px solid #f5f5f5;
  
}

</style>