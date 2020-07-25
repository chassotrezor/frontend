<template>
  <div
    class="row no-wrap justify-between bg-grey-4 rounded-borders shadow-3"
    style="width: 600px"
  >
    <q-btn
      class="ClickToOpen_test q-ma-sm"
      icon="edit"
      flat
      round
      size="xl"
      padding="sm"
      @click="edit"
    />
    <div
      class="q-pa-md text-h4 text-center cursor-pointer"
      @click="edit"
    >
      {{ trail.name }}
    </div>
    <q-btn
      class="DeleteBtn_test q-ma-sm"
      icon="delete_forever"
      color="negative"
      flat
      round
      size="xl"
      padding="sm"
      @click="confirmRemove"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TrailCard',
  props: {
    trailId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail'
    }),
    trail () {
      return this.getTrail({ trailId: this.trailId })
    }
  },
  methods: {
    ...mapActions({
      deleteTrail: 'editor/deleteTrail'
    }),
    edit () {
      this.$emit('edit')
    },
    confirmRemove () {
      const vm = this
      this.$q.dialog({
        title: this.$t('editor.trailsList.askRemoveTrail'),
        message: this.$t('editor.trailsList.allTrailDataWillBeLost'),
        ok: {
          label: this.$t('editor.trailsList.confirmRemoveTrail')
        },
        cancel: {
          label: this.$t('editor.trailsList.cancelRemoveTrail')
        }
      })
        .onOk(() => {
          vm.deleteTrail({ trailId: this.trailId })
        })
    }
  }
}
</script>
