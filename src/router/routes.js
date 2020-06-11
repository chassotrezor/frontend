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
            priority: 1000,
            icon: 'home'
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
        component: () => import('pages/Station.vue'),
        meta: {
          access: connected,
          display: {
            rule: never
          }
        }
      },
      {
        path: '/cluesList/',
        name: 'cluesList',
        component: () => import('pages/CluesList.vue'),
        meta: {
          access: connected,
          display: {
            rule: connected,
            group: types.displayGroups.NAVIGATION,
            priority: 100,
            icon: 'info'
          }
        }
      },
      {
        path: '/scanner/',
        name: 'scanner',
        component: () => import('pages/Scanner.vue'),
        meta: {
          access: connected,
          display: {
            rule: connected,
            group: types.displayGroups.NAVIGATION,
            priority: 1000,
            icon: 'perm_device_information'
          }
        }
      },
      {
        path: '/map/',
        name: 'map',
        component: () => import('pages/Map.vue'),
        meta: {
          access: anyTime,
          display: {
            rule: anyTime,
            group: types.displayGroups.NAVIGATION,
            priority: 10,
            icon: 'explore'
          }
        }
      },
      {
        path: '/creator/',
        name: 'creator',
        component: () => import('pages/Creator.vue'),
        meta: {
          access: anyTime,
          display: {
            rule: anyTime,
            group: types.displayGroups.NAVIGATION,
            priority: 1,
            icon: 'edit'
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
