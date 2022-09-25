/*
 * @Description: 用户登录状态模块
 * @Author: hai-27
 * @Date: 2020-02-19 17:42:11
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-26 23:14:32
 */
export default {
  //自定义变量
  state: {
    user: "", // 登录的用户
    showLogin: false, // 用于控制是否显示登录组件
    showAddAddress:false//显示是否显示地址组件
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getShowLogin (state) {
      return state.showLogin
    },
    getShowAddAddress(state){
      return state.showAddAddress
    }
  },
  mutations: {
    setUser (state, data) {
      state.user = data;
    },
    setShowLogin (state, data) {
      state.showLogin = data;
    },
    showNewAddress(state,data){
      state.showAddAddress=data;
    }
  },
  actions: {
    setUser ({ commit }, data) {
      commit('setUser', data);
    },
    setShowLogin ({ commit }, data) {
      commit('setShowLogin', data);
    },
    showNewAddress({ commit },data){
      commit('showNewAddress',data)
      
    }
  }
}