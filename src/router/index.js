import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  const reRoute = (isConnected) => {
    if (isConnected) {
      console.log('home', Router.currentRoute.name)
      return { name: 'home' }
    } else {
      console.log('sign', Router.currentRoute.name)
      return { name: 'sign' }
    }
  }

  // Router.beforeEach((to, from, next) => {
  //   if (to.meta.access) {
  //     const isConnected = !!firebase.auth().currentUser
  //     if (isConnected) to.meta.access.connected ? next() : next(reRoute(true))
  //     else to.meta.access.notConnected ? next() : next(reRoute(false))
  //   } else {
  //     next({ name: 'roller' })
  //   }
  // })

  firebase.auth().onAuthStateChanged(user => {
    const isConnected = !!user
    const targetRoute = reRoute(isConnected)
    if (targetRoute.name !== Router.currentRoute.name) {
      console.log('push')
      Router.push(targetRoute)
    } else {
      console.log('do not push')
    }
  })

  return Router
}
