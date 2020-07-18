<template>
  <q-page-sticky
    v-if="difference"
    class="q-py-sm row"
    position="top-right"
    style="z-index: 5001"
  >
    <q-btn
      class="q-mr-md"
      icon="cloud_upload"
      color="warning"
      text-color="black"
      no-caps
      :label="$t('editor/saveChanges')"
      @click="updateFn"
    />
    <q-btn
      class="q-mr-sm"
      icon="undo"
      color="warning"
      text-color="black"
      no-caps
      :label="$t('editor/cancelChanges')"
      @click="cancelFn"
    />
  </q-page-sticky>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { isEqual } from 'lodash'

export default {
  name: 'UpdateBtn',
  props: {
    oldData: {
      type: [Number, String, Array, Object],
      required: true
    },
    newData: {
      type: [Number, String, Array, Object],
      required: true
    },
    updateFn: {
      type: Function,
      required: true
    },
    cancelFn: {
      type: Function,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      routeGuard: 'editor/routeGuard'
    }),
    difference () {
      return !isEqual(this.oldData, this.newData)
    }
  },
  watch: {
    routeGuard (routeGuard) {
      const vm = this
      if (routeGuard.action === 'routeUpdate' || routeGuard.action === 'routeLeave') {
        if (this.difference) {
          this.$q.dialog({
            title: 'Changements non sauvegardés',
            persistent: true,
            ok: {
              label: 'sauvegarder et continuer'
            },
            cancel: {
              label: 'rester sur la page'
            }
          }).onOk(() => {
            vm.updateFn()
            routeGuard.next()
          }).onCancel(() => {
            routeGuard.next(false)
          })
        } else {
          routeGuard.next()
        }
        vm.releaseGuard()
      }
    }
  },
  methods: {
    ...mapActions({
      delegateRouteGuard: 'editor/delegateRouteGuard'
    }),
    releaseGuard () {
      this.delegateRouteGuard({ next: () => {}, action: null })
    }
  }
}
</script>
