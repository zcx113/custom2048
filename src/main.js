// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import routerConfig from './router-config'
import './global/base.less'
Vue.use(VueRouter)

let routes = Object.values(routerConfig).reduce((result, item) => {
  Object.entries(item).forEach(([key, value]) => {
    result.push({
      path: key,
      ...value
    })
  })
  return result
}, [])
console.log(routes)

routes.push({
  path: '*',
  redirect: '/page-index'
})

Vue.config.productionTip = false

let router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes
})
// console.log(App)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: (h) => h(App)
})
