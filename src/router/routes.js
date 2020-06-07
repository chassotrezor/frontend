import types from 'src/types'

const anyTime = [
  types.connection.CONNECTED,
  types.connection.DISCONNECTED
]

const connected = [
  types.connection.CONNECTED
]

const disconnected = [
  types.connection.DISCONNECTED
]

const never = []

// priority: the route with the greatest priority will be displayed first in the layout drawer

const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/Index.vue'),
        meta: {
          access: anyTime,
          display: {
            rule: anyTime,
            group: types.displayGroups.NAVIGATION,
            priority: 1000
          }
        }
      },
      {
        path: '/sign',
        name: 'sign',
        component: () => import('pages/Sign.vue'),
        meta: {
          access: disconnected,
          display: {
            rule: disconnected,
            group: types.displayGroups.CONNECTION,
            priority: 1000,
            icon: 'person'
          }
        }
      },
      {
        path: '/logout',
        name: 'logout',
        component: () => import('pages/Logout.vue'),
        meta: {
          access: connected,
          display: {
            rule: connected,
            group: types.displayGroups.CONNECTION,
            priority: 1000,
            icon: 'close'
          }
        }
      },
      {
        path: '/chase/:chaseId/clue/:clueId',
        name: 'clue',
        component: () => import('pages/Clue.vue'),
        meta: {
          access: connected,
          display: {
            rule: never
          }
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
