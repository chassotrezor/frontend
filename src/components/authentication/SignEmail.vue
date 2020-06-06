<template>
  <div>
    <q-input
      v-model="email"
      class="emailInput_test"
      type="email"
      :label="$t('auth.email')"
      :hint="$t('auth.emailHint')"
      :error-message="$t('auth.emailError')"
      :error="$v.email.$error"
      @blur="$v.email.$touch()"
    />
    <q-btn
      class="backBtn_test"
      round
      icon="navigate_before"
      @click="$emit('back')"
    />
    <q-btn
      class="sendBtn_test"
      rounded
      icon="person"
      :label="$t('auth.connect')"
      :disable="$v.email.$invalid"
      @click="$emit('email', email)"
    />
  </div>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'

export default {
  name: 'SignEmail',
  data () {
    return {
      email: ''
    }
  },
  validations: {
    email: {
      required,
      email
    }
  }
}
</script>
