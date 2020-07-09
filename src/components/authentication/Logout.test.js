import { mountQuasar } from '@test'
import { signOut, setSignOut } from '@firebaseAuth'

import Logout from './Logout'

let signOutSuccess
setSignOut(jest.fn(() => {
  return new Promise(resolve => {
    signOutSuccess = resolve
  })
}))

const $router = {
  push: jest.fn()
}

describe('Logout', () => {
  let wrapper

  describe('when mounted', () => {
    beforeAll(async () => {
      wrapper = mountQuasar(Logout, {
        mocks: {
          $router
        }
      })
      await wrapper.vm.$nextTick()
    })

    it('displays a "SpinnerWithMessage"', () => {
      const spinner = wrapper.find('.SpinnerWithMessage_test')
      expect(spinner.exists()).toBe(true)
    })

    it('signs out from backend', () => {
      expect(signOut).toHaveBeenCalled()
    })

    describe('when "signOut" resolves', () => {
      beforeAll(async () => {
        signOutSuccess()
        await wrapper.vm.$nextTick()
      })

      it('displays a "SuccessWithMessage"', () => {
        const success = wrapper.find('.SuccessWithMessage_test')
        expect(success.exists()).toBe(true)
      })

      it('displays a "go home QBtn"', () => {
        const btn = wrapper.find('.HomeBtn_test')
        expect(btn.exists()).toBe(true)
      })

      describe('when "go home QBtn" emits "click"', () => {
        beforeAll(async () => {
          const btn = wrapper.find('.HomeBtn_test')
          btn.vm.$emit('click')
          await wrapper.vm.$nextTick()
        })

        it('routes user to home', () => {
          expect($router.push).toHaveBeenCalledWith({ name: 'home' })
        })
      })
    })
  })
})
