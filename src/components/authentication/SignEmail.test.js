import { mountQuasar } from '@test'
import SignEmail from './SignEmail'
import 'boot/vuelidate'

const invalidEmail = 'invalid@email'
const validEmail = 'valid@email.com'

describe('SignEmail', () => {
  const wrapper = mountQuasar(SignEmail)

  describe('e-mail input', () => {
    const emailInput = wrapper.find('.emailInput_test')

    it('shows an error on blur when its value is not an e-mail', () => {
      return new Promise(resolve => {
        emailInput.vm.$emit('input', invalidEmail)
        emailInput.vm.$emit('blur')
        emailInput.vm.$nextTick(() => {
          expect(emailInput.props().error).toBe(true)
          resolve()
        })
      })
    })

    it('shows no error on blur when its value is an e-mail', () => {
      return new Promise(resolve => {
        emailInput.vm.$emit('input', validEmail)
        emailInput.vm.$emit('blur')
        emailInput.vm.$nextTick(() => {
          expect(emailInput.props().error).toBe(false)
          resolve()
        })
      })
    })
  })

  describe('back button', () => {
    test('component emits "back" event when clicked', () => {
      return new Promise(resolve => {
        const btn = wrapper.find('.backBtn_test')
        btn.vm.$emit('click')
        wrapper.vm.$nextTick(() => {
          expect(wrapper.emitted('back')).toBeTruthy()
          resolve()
        })
      })
    })
  })

  describe('send email link button', () => {
    it('is disabled when email is invalid', () => {
      const emailInput = wrapper.find('.emailInput_test')
      emailInput.vm.$emit('input', invalidEmail)
      const btn = wrapper.find('.sendBtn_test')
      return new Promise(resolve => {
        btn.vm.$nextTick(() => {
          expect(btn.props().disable).toBe(true)
          resolve()
        })
      })
    })

    test('component emits "email" event with email payload when button emits "click" event', () => {
      const emailInput = wrapper.find('.emailInput_test')
      emailInput.vm.$emit('input', validEmail)
      const btn = wrapper.find('.sendBtn_test')
      btn.vm.$emit('click')
      return new Promise(resolve => {
        wrapper.vm.$nextTick(() => {
          expect(wrapper.emitted('email')[0][0]).toBe(validEmail)
          resolve()
        })
      })
    })
  })
})
