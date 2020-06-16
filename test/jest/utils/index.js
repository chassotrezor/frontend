// this is mapped in jest.config.js to resolve @vue/test-utils
import { createLocalVue, shallowMount } from 'test-utils'

import Vuex from 'vuex'
import VueRouter from 'vue-router'
import * as All from 'quasar'
// import langEn from 'quasar/lang/en-us' // change to any language you wish! => this breaks wallaby :(
const { Quasar, Cookies } = All

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key]
  if (val && val.component && val.component.name != null) {
    object[key] = val
  }
  return object
}, {})

const mockSsrContext = () => {
  return {
    req: {
      headers: {}
    },
    res: {
      setHeader: () => undefined
    }
  }
}

// https://eddyerburgh.me/mock-vuex-in-vue-unit-tests
export const mountQuasar = (component, options = {}) => {
  const localVue = createLocalVue()
  const app = {}

  localVue.use(Quasar, { components })

  let store
  if (options.store) {
    localVue.use(Vuex)
    store = new Vuex.Store(options.store)
  }

  let router
  if (options.routes) {
    localVue.use(VueRouter)
    router = new VueRouter({ routes: options.routes })
  }

  if (options) {
    const ssrContext = options.ssr ? mockSsrContext() : null

    if (options.cookies) {
      const cookieStorage = ssrContext ? Cookies.parseSSR(ssrContext) : Cookies
      const cookies = options.cookies
      Object.keys(cookies).forEach(key => {
        cookieStorage.set(key, cookies[key])
      })
    }

    if (options.plugins) {
      options.plugins.forEach(plugin => {
        plugin({ app, store, Vue: localVue, ssrContext })
      })
    }
  }

  // mock vue-i18n
  const $t = () => 'mock $t'
  const $tc = () => 'mock $tc'
  const $n = () => 'mock $n'
  const $d = () => 'mock $d'

  return shallowMount(component, {
    localVue: localVue,
    store,
    router,
    mocks: { $t, $tc, $n, $d, ...options.mocks },
    // Injections for Components with a QPage root Element
    provide: {
      pageContainer: true,
      layout: {
        header: {},
        right: {},
        footer: {},
        left: {}
      }
    },
    slots: options.slots,
    propsData: options.propsData
  })
}
