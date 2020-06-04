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
    <q-input
      v-model="confirmPassword"
      :label="$t('auth.confirmPassword')"
      type="password"
    />
    <q-btn
      :label="$t('auth.createAccount')"
      @click="signup({ email, password })"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Signin',
  data () {
    return {
      email: 'comte.harbour@gmail.com',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    ...mapActions({
      signup: 'auth/signup'
    })
  }
}
</script>
