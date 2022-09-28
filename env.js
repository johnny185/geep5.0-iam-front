module.exports = {
    development: {
        MODE: 'development',
        ENV_API: 'http://10.255.132.40:8888'   //测试服务器地址
    },
    test: {
        MODE: 'test',
        ENV_API: 'http://10.255.132.7'   //测试服务器地址
    },
    production: {
        MODE: 'production',
        ENV_API: 'http://10.255.132.7'  // 正式服务器地址
    }
}