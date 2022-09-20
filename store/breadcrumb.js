//import { setUserInfo, removeUserInfo } from '@/utils/auth'
export const state = () => {
  return {
    routeInfo: []
  }
}
export const mutations = {
  // 添加面包屑title信息
  addTitle(state, data) {
    if (data.meta && data.meta.level === 1) {
      state.routeInfo = []
      state.routeInfo.push(data)
    } else if (data.meta.level > state.routeInfo.length) {
      state.routeInfo.push(data)
    }


    console.log("addTitle-data", data)
    console.log("addTitle-routeInfo", state.routeInfo)

  },
}
