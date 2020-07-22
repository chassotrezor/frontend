<template>
  <q-layout view="hHh lpR fFf">
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
        <q-btn
          v-if="rightDrawerStatus"
          flat
          dense
          round
          size="lg"
          padding="none"
          :icon="rightDrawerOpen ? 'arrow_right' :'arrow_left'"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <navigation-link
          v-for="route in routes[types.displayGroups.NAVIGATION]"
          :key="route.name"
          :title="$t(`routes.${route.name}`)"
          :route="route"
          :icon="route.meta.display.icon"
        />
        <q-item />
        <navigation-link
          v-for="route in routes[types.displayGroups.CONNECTION]"
          :key="route.name"
          :title="$t(`routes.${route.name}`)"
          :route="route"
          :icon="route.meta.display.icon"
        />
      </q-list>
    </q-drawer>
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      bordered
      content-class="bg-grey-1"
    >
      <history-drawer-content
        v-if="rightDrawerStatus === 'history'"
      />
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import firebase from 'firebase/app'
import NavigationLink from 'components/Navigation/NavigationLink'
import HistoryDrawerContent from 'components/history/HistoryDrawerContent'
import routes from 'src/router/routes'
import types from 'src/types'

export default {
  name: 'Layout',

  components: {
    NavigationLink,
    HistoryDrawerContent
  },

  data () {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
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
    },

    rightDrawerStatus () {
      switch (this.$route.name) {
        case 'history': return 'history'
        default: return null
      }
    }
  },

  mounted () {
    const vm = this
    vm.removeObserver = firebase.auth().onAuthStateChanged(user => {
      vm.connectionState = user ? types.connection.CONNECTED : types.connection.DISCONNECTED
      if (user) this.$store.dispatch('user/updateAccessibleStations')
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.rightDrawerOpen = false
    next()
  },

  beforeDestroy () {
    this.removeObserver()
  },

  methods: {
    mustBeDisplayed (displayRule) {
      const vm = this
      const connectionStateIsValid = displayRule.allowedConnectionStates
        .some(allowedState => allowedState === vm.connectionState)
      const vuexStateIsValid = !displayRule.forcedVuexGetterStates ||
        displayRule.forcedVuexGetterStates.every(check => {
          const value = vm.$store.getters[check.getter]
          const valueIsValid = check.ifValid(value)
          return valueIsValid
        })
      return connectionStateIsValid && vuexStateIsValid
    }
  }
}
</script>
