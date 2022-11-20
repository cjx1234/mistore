<template>
  <div id="app" name="app">
    <el-container>
      <!-- 顶部导航 -->
      <div class="topbar">
        <div class="nav">
          <ul>
            <li v-if="!this.$store.getters.getUser">
              <el-button type="text" @click="login">登录</el-button>
              <span class="sep">|</span>
              <el-button type="text" @click="register = true">注册</el-button>
            </li>
            <li v-else>
              欢迎
              <el-popover placement="top" width="180" v-model="visible">
                <p>确认退出登录吗？</p>
                <div style="text-align: right; margin: 10px 0 0">
                  <el-button size="mini" type="text" @click="visible = false"
                    >取消</el-button
                  >
                  <el-button type="primary" size="mini" @click="logout"
                    >确定</el-button
                  >
                </div>
                <el-button type="text" slot="reference">{{
                  this.$store.getters.getUser.userName
                }}</el-button>
              </el-popover>
            </li>
            <li>
              <router-link to="/order">我的订单</router-link>
            </li>
            <li>
              <router-link to="/collect">我的收藏</router-link>
            </li>
            <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'" class="shop">
              <router-link to="/shoppingCart">
                <i class="el-icon-shopping-cart-full font"  >
                  购物车</i
                >
                <span class="num" >({{ getNum }})</span>
              </router-link>
              <div class="shopping">
                <div class="menu-content">
                  <ul
                    v-if="getNum > 0"
                    style="color: black"
                    class="cart-list"
                    :class="getNum > 0 ? '' : 'hide'"
                  >
                    <li
                      class="product-list"
                      v-for="(item, index) in getShoppingCart"
                      :key="item.id"
                    >
                      <div class="cart-item">
                        <router-link
                          class="pro-img"
                          :to="{
                            path: '/goods/details',
                            query: { productID: item.productID },
                          }"
                        >
                          <img :src="$target + item.productImg" />
                        </router-link>
                        <router-link
                          class="pro-name"
                          :to="{
                            path: '/goods/details',
                            query: { productID: item.productID },
                          }"
                          >{{ item.productName }}</router-link
                        >
                        <span class="pro-price">{{ item.price }}元</span>
                      </div>
                    </li>
                  </ul>
                  <div v-else style="color: black">
                    购物车中还没有商品，赶紧选购吧！
                  </div>
                  <div
                    v-if="getNum > 0"
                    class="cart-total clearfix"
                    :class="getNum > 0 ? '' : 'hide'"
                  >
                    <span class="total">
                      共<em>{{ getNum }}</em
                      >件商品
                      <span class="price">
                        <em>{{ getTotalPrice }}</em
                        >元
                      </span>
                    </span>
                    <router-link
                      to="/shoppingCart"
                      class="btn btn-primary btn-cart"
                      >去购物车结算</router-link
                    >
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 顶栏容器 -->
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          active-text-color="#409eff"
          router
        >
          <div class="logo">
            <router-link to="/">
              <img src="./assets/imgs/logo.png" alt />
            </router-link>
          </div>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/goods">全部商品</el-menu-item>
          

          <div class="so">
            <el-input placeholder="请输入搜索内容" v-model="search">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchClick"
              ></el-button>
            </el-input>
          </div>
        </el-menu>
      </el-header>
      <!-- 顶栏容器END -->

      <!-- 登录模块 -->
      <MyLogin></MyLogin>
      <!-- 注册模块 -->
      <MyRegister :register="register" @fromChild="isRegister"></MyRegister>

      <!-- 主要区域容器 -->
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
      <!-- 主要区域容器END -->
      
      <!-- 底栏容器 -->
      <el-footer>
        <div class="footer">
          <div class="ng-promise-box">
            <div class="ng-promise">
              <p class="text">
                <a class="icon1" href="javascript:;">7天无理由退换货</a>
                <a class="icon2" href="javascript:;">满99元全场免邮</a>
                <a class="icon3" style="margin-right: 0" href="javascript:;"
                  >100%品质保证</a
                >
              </p>
            </div>
          </div>
          <div class="github">
            <a href="https://github.com/hai-27/vue-store" target="_blank">
              <div class="github-but"></div>
            </a>
          </div>
          <div class="mod_help">
            <p>
              <router-link to="/">首页</router-link>
              <span>|</span>
              <router-link to="/goods">全部商品</router-link>
              <span>|</span>
              <router-link to="/about">关于Cjx</router-link>
            </p>
            <p class="coty">商城版权所有 &copy; 2012-2022</p>
          </div>
        </div>
      </el-footer>
      <!-- 底栏容器END -->
    </el-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  beforeUpdate() {
    this.activeIndex = this.$route.path;
  },
  data() {
    return {
      activeIndex: "", // 头部导航栏选中的标签
      search: "", // 搜索条件
      register: false, // 是否显示注册组件
      visible: false, // 是否退出登录
    };
  },
  created() {
    //获取浏览器本地存储,判断是否已经登录
    if (localStorage.getItem("user")) {
      //如果登录，设置vuex登录状态
      //JSON.parse解析JSON数据为字符串，并对格式进行检查
      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
  },
  computed: {
    ...mapGetters(["getUser", "getNum", "getShoppingCart", "getTotalPrice"]),
  },
  watch: {
    //获取vuex登录状态
    getUser: function (val) {
      if (val === "") {
        //没有登录
        this.setShoppingCart([]);
      } else {
        //已经登录，发送axions请求，获取购物车信息
        this.$axios
          .post("/api/user/shoppingCart/getShoppingCart", {
            //替换用户id为服务器数据
            user_id: val.user_id,
          })
          .then((res) => {
            if (res.data.code === "001") {
              // 001 为成功, 更新vuex购物车状态
              this.setShoppingCart(res.data.shoppingCartData);
            } else {
              // 提示失败信息
              this.notifyError(res.data.msg);
            }
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
    },
  },
  methods: {
    ...mapActions(["setUser", "setShowLogin", "setShoppingCart"]),
    login() {
      // 点击登录按钮, 通过更改vuex的showLogin值显示登录组件
      this.setShowLogin(true);
    },
    // 退出登录
    logout() {
      this.visible = false;
      // 清空本地登录信息
      localStorage.setItem("user", "");
      // 清空vuex登录信息
      this.setUser("");
      this.notifySucceed("成功退出登录");
    },
    // 接收注册子组件传过来的数据
    isRegister(val) {
      this.register = val;
    },
    // 点击搜索按钮
    searchClick() {
      if (this.search != "") {
        // 跳转到全部商品页面,并传递搜索条件
        this.$router.push({ path: "/goods", query: { search: this.search } });
        this.search = "";
      }
    },
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  border: 0;
  list-style: none;
}
#app .el-header {
  padding: 0;
}
#app .el-main {
  min-height: 300px;
  padding: 20px 0;
}
#app .el-footer {
  padding: 0;
}
a,
a:hover {
  text-decoration: none;
}

/* 顶部导航栏CSS */
.topbar {
  height: 40px;
  background-color: #3d3d3d;
  margin-bottom: 20px;
}
.topbar .nav {
  /* width:1225px */
  width: 1225px;
  margin: 0 auto;
}
.topbar .nav ul {
  float: right;
}
.topbar .nav li {
  float: left;
  height: 40px;
  color: #b0b0b0;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  margin-left: 20px;
}
.topbar .nav .sep {
  color: #b0b0b0;
  font-size: 12px;
  margin: 0 5px;
}
.topbar .nav li .el-button {
  color: #b0b0b0;
}
.topbar .nav .el-button:hover {
  color: #fff;
}
.topbar .nav li a {
  color: #b0b0b0;
}
.topbar .nav a:hover {
  color: #fff;
}
.topbar .nav .shopCart {
  width: 120px;
  background: #424242;
  
}
.topbar .nav .shopCart:hover {
  background: #fff;
}
.topbar .nav .shopCart:hover a {
  color: #ff6700;
}
.topbar .nav .shopCart-full {
  width: 120px;
  background: #ff6700;  
}
.topbar .nav .shopCart-full a{
 color: #fff;  
}
.topbar .nav .shopCart-full:hover {
  background: #fff;
}
.topbar .nav .shopCart-full:hover a {
  color: #ff6700;
}
.shop {
  transition: all 0.2s;
}
/* 购物车弹层 */
.shopping {
  position: absolute;
  right: 0;
  top: 40px;
  z-index: 31;
  width: 316px;
  /* height: 0px; */
  max-height: 0px;
  color: #424242;
  background: #fff;
  box-shadow: 0 2px 10px rgb(0 0 0 /15%);
  overflow: hidden;
  transition:  0.5s;
  margin-right: 147px;
}
.shop:hover .font{
  color: #ff6700;
}
.shop:hover .shopping {
  /* height: auto; */
  max-height: 350px;
}
.shopping .menu-content {
  padding: 20px 0 0;
}
.hide {
  display: none !important;
}
.cart-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.cart-list li {
  position: relative;
  height: 80px !important;
  padding: 0 20px;
}
.cart-item {
  position: relative;
  height: 60px;
  padding: 10px 0;
  line-height: 20px;
  border-top: 1px solid #e0e0e0;
}
.pro-img {
  float: left;
  margin-right: 10px;
}
.cart-item .pro-img img {
  width: 60px;
  height: 60px;
}
.cart-item .pro-name {
  float: left;
  width: 95px;
  height: 40px;
  line-height: 20px;
  margin: 10px 0;
  color: #424242 !important;
  overflow: hidden;
  /* display: inline-block; */
}
.cart-item .pro-name:hover {
  color: #ff6700 !important;
}
.cart-item .pro-price {
  float: right;
  margin: 20px 20px 0 5px;
  color: #424242 !important;
}
.cart-total {
  padding: 15px 20px;
  background: #fafafa !important ;
}
.cart-total .total {
  margin-top: -10px;
  float: left;
  width: 135px;
  color: #757575 !important;
  font-size: 12px;
}
.cart-total .price {
  display: block;
  font-weight: 400;
  color: #ff6700;
  margin-top: -20px;
}
.cart-total .price em {
  font-size: 14px;
  line-height: 1;
}
.cart-total .btn-cart {
  float: right;
  width: 130px;
  padding: 0;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
  color: #f5f5f5 !important;
  background: #ff6700;
}
/* 顶部导航栏CSS END */

/* 顶栏容器CSS */
.el-header .el-menu {
  max-width: 1225px;
  margin: 0 auto;
}
.el-header .logo {
  height: 60px;
  width: 189px;
  float: left;
  margin-right: 100px;
}
.el-header .so {
  margin-top: 10px;
  width: 300px;
  float: right;
}
/* 顶栏容器CSS END */

/* 底栏容器CSS */
.footer {
  width: 100%;
  text-align: center;
  background: #2f2f2f;
  padding-bottom: 20px;
}
.footer .ng-promise-box {
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box {
  margin: 0 auto;
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box .ng-promise p a {
  color: #fff;
  font-size: 20px;
  margin-right: 210px;
  padding-left: 44px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-decoration: none;
  background: url("./assets/imgs/us-icon.png") no-repeat left 0;
}
.footer .github {
  height: 50px;
  line-height: 50px;
  margin-top: 20px;
}
.footer .github .github-but {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  background: url("./assets/imgs/github.png") no-repeat;
}
.footer .mod_help {
  text-align: center;
  color: #888888;
}
.footer .mod_help p {
  margin: 20px 0 16px 0;
}

.footer .mod_help p a {
  color: #888888;
  text-decoration: none;
}
.footer .mod_help p a:hover {
  color: #fff;
}
.footer .mod_help p span {
  padding: 0 22px;
}
/* 底栏容器CSS END */
</style>
