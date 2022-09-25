
module.exports = {
  //关闭eslint检查
  lintOnSave:false,
  publicPath:'./',
  devServer:{
    open:true,
    proxy:{
      '/api':{
        target:'http://101.132.181.9:3000/',
        //允许跨域
        changeOrigin:true,
        pathRewrite:{
          '^/api':''
        }
      }
    }
  }
}
