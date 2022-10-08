// import axios from 'axios'
// axios.defaults.withCredentials = true// 跨域处理 允许携带cookie
import { Notification } from 'element-ui'
import {getToken} from '../utils/auth'
export default function ({ $axios, redirect }) {
	//正常请求返回处理 
    $axios.onRequest(config => {
      if(getToken()){
        config.headers.Authorization = getToken()
      }
      config.headers.AppID = 8134005370347520
      return config
    })
    $axios.onResponse(response=>{
      console.log(response)
      const res = response.data
      if(res.status === 200 || res.status === 290){
        return res
      }else{
        if(res.status === 401){
          Notification({
            title: '提示',
            message: 'token失效重新登陆',
            type: 'error',
            duration: 2000
          })
          let params = {
            username: '', //用户名称
            registerStatus: '', //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
            avatarUrl: '', //帐户头像
            nickName: '', //昵称
            account: '',
            token: ''
          };
          !$nuxt.$store.commit('user/resetUserd', params);
          !$nuxt.$router.push({
            path:'/login'
          })
        }else{
          return Promise.reject(res.message)
        }
      }
    })
    //错误请求返回处理
    $axios.onError(error => {
      if(error.request.status === 500){
        error = '网络不给力'
      }
      // const code = parseInt(error.response && error.response.status)
      Notification({
        title: '提示',
        message: error,
        type: 'error',
        duration: 2000
      })
      //       switch (code) {
      //       	//错误代码
      //           case 401:
      //               sessionStorage.clear();
      //               redirect('/login')
      //               break;
      //           case 403:
      //               sessionStorage.clear();
      //               redirect('/login')
      //               break;
      //           case 404:
      //               sessionStorage.clear();
      //               break;
      //           case 500:
      //               Message.error("Server exception");
      //               break;
      //           case 502:
      //               Message.error("Bad Gateway");
      //               break;
      //           case 503:
      //               Message.error(error.message);
      //               break;
      //           case 504:
      //               Message.error(error.message);
      //               break;
      //           default:
      //               break;
      //       }
      return Promise.reject(error)
    })
  }