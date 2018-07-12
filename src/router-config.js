export default {
  '索引列表': {
    '/page-index': {
      meta: {
        title: '页面导航'
      },
      component: () => import('./biz/pageIndex/index')
    },
    '/custom2048': {
      meta: {
        title: '2048'
      },
      component: () => import('./biz/custom2048/index')
    }
  }
}
