<template>
  <q-page-sticky
    v-if="difference"
    class="q-py-sm row"
    position="top-right"
    style="z-index: 2001"
  >
    <q-btn
      class="q-mr-sm CancelChangesBtn_test"
      icon="undo"
      color="warning"
      text-color="black"
      no-caps
      :label="$t('editor.changes.cancelChanges')"
      @click="cancelFn"
    />
    <q-btn
      class="q-mr-md SaveChangesBtn_test"
      icon="cloud_upload"
      color="warning"
      text-color="black"
      no-caps
      :label="$t('editor.changes.saveChanges')"
      @click="updateFn"
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
            title: this.$t('editor.changes.unsavedChanges'),
            persistent: true,
            ok: {
              noCaps: true,
              label: this.$t('editor.changes.saveAndContinue')
            },
            cancel: {
              noCaps: true,
              label: this.$t('editor.changes.stayOnPage')
            }
          }).onOk(() => {
            vm.updateFn()
            routeGuard.next()
            vm.releaseGuard()
          }).onCancel(() => {
            routeGuard.next(false)
            vm.releaseGuard()
          })
        } else {
          routeGuard.next()
          vm.releaseGuard()
        }
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
