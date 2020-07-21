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
        path: '/:trailId/:stationId',
        name: 'station',
        component: () => import('pages/Station.vue'),
        meta: {
          access: anyTime,
          display: {
            rule: never
          }
        }
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('pages/History.vue'),
        meta: {
          access: anyTime,
          display: {
            rule: anyTime,
            group: types.displayGroups.NAVIGATION,
            priority: 100,
            icon: 'info'
          }
        }
      },
      {
        path: '/scanner',
        name: 'scanner',
        component: () => import('pages/Scanner.vue'),
        meta: {
          access: anyTime,
          display: {
            rule: anyTime,
            group: types.displayGroups.NAVIGATION,
            priority: 1000,
            icon: 'perm_device_information'
          }
        }
      },
      {
        path: '/map',
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
        path: '/editor',
        name: 'editor',
        component: () => import('pages/Editor.vue'),
        meta: {
          access: connected,
          display: {
            rule: connected,
            group: types.displayGroups.NAVIGATION,
            priority: 1,
            icon: 'edit'
          }
        },
        children: [{
          path: '/editor/:trailId',
          name: 'trailEditor',
          component: () => import('pages/Editor.vue'),
          meta: {
            access: connected,
            display: {
              rule: never
            }
          },
          children: [{
            path: '/editor/:trailId/:stationId',
            name: 'stationEditor',
            component: () => import('pages/Editor.vue'),
            meta: {
              access: connected,
              display: {
                rule: never
              }
            }
          }]
        }]
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
