module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy: 'http://192.168.1.50:8000/',
    port: 3000
  }
}
