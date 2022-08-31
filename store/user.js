// import { setUserInfo, removeUserInfo } from '@/utils/auth'
export const state = () => {
  return{
    userInfo: {
      username:"",//用户名称
      registerType:"",//认证状态  0是未认证 1是已认证
      avatarUrl:"",//帐户头像
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
  // 认证状态 0未认证 1认证中
  addRegisterType(state, registerType) {
    state.userInfo.registerType = registerType
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