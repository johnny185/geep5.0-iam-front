import {getToken} from '../utils/auth'
export default({app,store})=>{
  // console.log('触发123')
  let token = getToken()
  app.router.beforeEach((to,from,next)=>{
    // console.log(to, from)
    //  next()
    if(token){
      next()
      // console.log('跳登录')
      // next({path:'/login'});
      // return
    }else{
      if (to.path === "/login" || to.path === '/login/register' || to.path === '/login/forget') {
        next()
      } else {
        next({path: "/login"})
      }
       console.log('不跳登录')
      // next({path: "/login"})
    }
  })
}
// export default ({ app }) => {
//   console.log(getToken(),'token')
//   app.router.beforeEach( (to, from, next) => {
//     console.log(to, from, 'from')
//     // if(getToken() ){
//     //   console.log('有token')
//     // }else{
//     //   console.log('没有token')
//     // }
//     // console.log('to：',to.path);
//     // console.log('from', from.path);
//     next()
//   })
//   app.router.afterEach((to, from) => {
//     // console.log(to)
//   })
// }