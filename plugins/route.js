
 export default ({ app }) => {
  app.router.beforeEach( (to, from, next) => {
    // console.log('to：',to.path);
    // console.log('from', from.path);
    next()
  })
  app.router.afterEach((to, from) => {
    // console.log(to)
  })
}