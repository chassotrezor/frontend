<template>
  <div>
    <q-input
      v-model="email"
      :label="$t('auth.email')"
    />
    <q-input
      v-model="password"
      :label="$t('auth.password')"
      type="password"
    />
    <q-btn
      :label="$t('auth.connect')"
      @click="signin({ email, password })"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Signup',
  data () {
    return {
      email: 'comte.harbour@gmail.com',
      password: ''
    }
  },
  methods: {
    ...mapActions({
      signin: 'auth/signin'
    })
  }
}
</script>
