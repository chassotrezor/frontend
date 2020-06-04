<template>
  <div>
    <signup
      v-if="sign === 'up'"
    />
    <signin
      v-else
    />
    <q-btn
      :label="toggleLabel"
      @click="toggleSign"
    />
  </div>
</template>

<script>
import Signup from './Signup'
import Signin from './Signin'

export default {
  name: 'Authentication',
  components: {
    Signup,
    Signin
  },
  data () {
    return {
      sign: 'up'
    }
  },
  computed: {
    toggleLabel () {
      if (this.sign === 'up') return this.$t('auth.toggle.goToSignin')
      else return this.$t('auth.toggle.goToSignup')
    }
  },
  methods: {
    toggleSign () {
      if (this.sign === 'up') this.sign = 'in'
      else this.sign = 'up'
    }
  }
}
</script>
