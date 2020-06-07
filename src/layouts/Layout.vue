<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Chassotrezor
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <navigation-link
          v-for="route in routes[types.displayGroups.CONNECTION]"
          :key="route.name"
          :title="$t(`routes.${route.name}`)"
          :route="route"
          :icon="route.meta.display.icon"
        />
        <navigation-link
          v-for="route in routes[types.displayGroups.NAVIGATION]"
          :key="route.name"
          :title="$t(`routes.${route.name}`)"
          :route="route"
          :icon="route.meta.display.icon"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import firebase from 'firebase/app'
import NavigationLink from 'components/Navigation/NavigationLink'
import routes from 'src/router/routes'
import types from 'src/types'

export default {
  name: 'Layout',

  components: {
    NavigationLink
  },

  data () {
    return {
      leftDrawerOpen: false,
      connectionState: '',
      types,
      removeObserver: () => {}
    }
  },

  computed: {
    routes () {
      const vm = this
      const orderedRoutes = routes[0].children.reduce((routes, route) => {
        if (vm.mustBeDisplayed(route.meta.display.rule)) {
          routes[route.meta.display.group].push({
            name: route.name,
            meta: route.meta
          })
        }
        return routes
      }, {
        [types.displayGroups.CONNECTION]: [],
        [types.displayGroups.NAVIGATION]: []
      })

      Object.values(orderedRoutes).forEach(group => {
        group.sort((routeA, routeB) => {
          return routeB.meta.display.priority - routeA.meta.display.priority
        })
      })

      return orderedRoutes
    }
  },

  mounted () {
    const vm = this
    vm.removeObserver = firebase.auth().onAuthStateChanged(user => {
      vm.connectionState = user ? types.connection.CONNECTED : types.connection.DISCONNECTED
    })
  },

  beforeDestroy () {
    this.removeObserver()
  },

  methods: {
    mustBeDisplayed (displayRule) {
      const vm = this
      return displayRule.some(value => value === vm.connectionState)
    }
  }
}
</script>
