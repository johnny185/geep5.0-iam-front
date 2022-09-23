const path = require('path')
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '统一身份认证系统',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      // { name:"referrer" ,content:"no-referrer" } 
    ],
    link: [
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      { rel: 'icon', type: 'image/x-icon', href: '/img/推送.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/css/reset.css',
    'element-ui/lib/theme-chalk/index.css',
    '~assets/css/common.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios',
    { src: '~plugins/wangEditor.js', ssr: false },
    { src: '~/plugins/store.js', ssr: false },
    { src: '~/plugins/desensitization.js', ssr: false },
    '@/plugins/route',
    { src: '@/plugins/auth', ssr: false },
    { src: '@/plugins/vue-count-to', ssr: true },
    { src: '~/plugins/vue-cropper', ssr: false },
    { src: '@/plugins/icons', ssr: true },
    // { src: '@/plugins/echarts.js', ssr: false },
    '@/plugins/echarts.js',
    '@/plugins/js-md5.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    "@nuxtjs/proxy"
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    vendor: ['axios'],
    extend(config, ctx) {
      // ...
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
      svgRule.exclude = [path.resolve(__dirname, 'assets/svg')]
      // Includes /icons/svg for svg-sprite-loader
      config.module.rules.push({
        test: /\.svg$/,
        include: [path.resolve(__dirname, 'assets/svg')],
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]'
        }
      })
    }
  },
  axios: {
    proxy: true, // 需要的，不设置请求无法转发
  },
  proxy: {
    '/api/': {
      // target: 'http://10.53.174.46:8848', // 请求  地址
      // target: 'http://10.255.132.40:8848', // 请求  地址
      target: 'http://10.255.132.40:8888', // 请求  地址
      // target: 'http://10.255.132.40:7001/api', // 请求  地址
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    },
    // '/jj': {
    //   target: 'http://10.53.173.54:8848', // 请求  地址
    //   // target: 'http://10.255.132.40:8848', // 请求  地址
    //   // target: 'http://10.53.174.46:8848', // 请求  地址
    //   changeOrigin: true,
    //   pathRewrite: { '^/jj': '' }
    // },



  }
}
