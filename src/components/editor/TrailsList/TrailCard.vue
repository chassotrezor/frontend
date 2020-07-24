<template>
  <div>
    <div
      class="
        cursor-pointer
        bg-grey-4
        q-pa-sm
        ClickToOpen_test
      "
      @click="edit"
    >
      {{ trail.name }}
    </div>
    <q-btn
      class="DeleteBtn_test"
      round
      icon="close"
      color="negative"
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
        title: this.$t('editor.askRemoveTrail'),
        message: this.$t('editor.allTrailDataWillBeLost'),
        ok: {
          label: this.$t('navigation.ok')
        },
        cancel: {
          label: this.$t('navigation.cancel')
        }
      })
        .onOk(() => {
          vm.deleteTrail({ trailId: this.trailId })
        })
    }
  }
}
</script>
