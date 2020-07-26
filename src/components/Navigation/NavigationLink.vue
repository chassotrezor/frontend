<template>
  <q-item
    class="text-dark"
    :class="itemClass"
    :clickable="!isCurrentRoute"
    @click="$router.push(route)"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon
        :name="icon"
        color="dark"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        {{ title }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'NavigationLink',
  props: {
    title: {
      type: String,
      required: true
    },

    route: {
      type: Object,
      required: true
    },

    icon: {
      type: String,
      default: ''
    }
  },

  computed: {
    isCurrentRoute () {
      const sameRoot = this.$route.path.split('/')[1] === this.route.path.split('/')[1]
      return sameRoot
    },

    itemClass () {
      if (this.isCurrentRoute) return 'bg-secondary text-weight-bold active_test'
      else return 'inactive_test'
    }
  }
}
</script>
