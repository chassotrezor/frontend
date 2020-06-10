import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'

import routes from './routes'
import types from 'src/types'

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

  const getConnectionState = user => {
    return user ? types.connection.CONNECTED : types.connection.DISCONNECTED
  }

  const getReplacingRoute = (connectionState) => {
    if (connectionState === types.connection.CONNECTED) {
      // return { name: 'home' }
      return {
        name: 'clue',
        params: {
          chaseId: 'testChaseID',
          clueId: 'testClueID'
        }
      }
    } else {
      return { name: 'sign' }
    }
  }

  Router.beforeEach((to, from, next) => {
    const connectionState = getConnectionState(firebase.auth().currentUser)
    const validRoute = to.meta.access && to.meta.access.some(access => access === connectionState)
    if (validRoute) next()
    else next(false)
  })

  firebase.auth().onAuthStateChanged(user => {
    const connectionState = getConnectionState(user)
    const targetRoute = getReplacingRoute(connectionState)
    if (targetRoute.name !== Router.currentRoute.name) {
      Router.push(targetRoute)
    }
  })

  return Router
}
