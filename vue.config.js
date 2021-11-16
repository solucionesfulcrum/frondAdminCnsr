module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy: 'http://10.0.52.70:8030/',
    port: 3020
  }
}
