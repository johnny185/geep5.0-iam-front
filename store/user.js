// import { setUserInfo, removeUserInfo } from '@/utils/auth'
export const state = () => {
  return{
    userInfo: {
      username:"",//用户名称
      registerStatus:"",//用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
      avatarUrl:"",//账户头像
      nickName:"",//昵称
      account:"",//
      token:""
    }
  }
}
export const mutations = {
  // 添加token
  addToken(state,data){
    state.userInfo = Object.assign(state.userInfo,{
      token:data
    })
  },
  // 添加用户信息
  addUserInfo (state, object) {
    // state = Object.assign(state,object) 
    state.userInfo = Object.assign( state.userInfo,object) 
  },
  // 退出登录 清空信息
  resetUserd(state,object){
    state.userInfo = object
    sessionStorage.removeItem('storeCache')
  }
}

// export const actions = {
//   getData (store) {
//     store.commit('add')
//   }
// }