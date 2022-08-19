export default ({ store, route, redirect }) => {
  let articleStatus = null
  route.matched.forEach((item, index) => {
    //区分最热最新板块
    if (route.query.hasOwnProperty('articleStatus')) {
      articleStatus = route.query.articleStatus
      if (articleStatus === 'hosttes') {
        item.meta.title = '最热'
      } else if (articleStatus === 'newest') {w
        item.meta.title = '最新'
      }
      //区分频道
    } else if (route.query.hasOwnProperty('routeTitleChannelName')) {
      item.meta.title = route.query.routeTitleChannelName
    } else {
      item.meta.title = route.meta[index].title || '';
    }
    item.meta.level = route.meta[index].level || '';
  })
  let { meta, name, path } = route.matched[0]
  // let channelName = null

  // if (route.query.hasOwnProperty('channelName')) {
  //   channelName = route.query.channelName
  // }
  //articleStatus = hosttes  //热门
  //articleStatus = newest  //最新

  let obj = {
    meta: meta,
    name: name,
    path: path,
    //channelName: channelName,
    //articleStatus: articleStatus
  }
  store.commit('breadcrumb/addTitle', obj);
}