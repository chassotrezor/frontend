import { mountQuasar } from '@test'
import Sign from './Sign'
import {
  getRedirectResult,
  // sendSignInLinkToEmail,
  setSendSignInLinkToEmail
} from '@firebaseAuth'

const testEmail = 'test@email.com'

describe('Sign', () => {
  let wrapper

  describe('when accessing from navigation, after getRedirectResult has resolved', () => {
    beforeAll(done => {
      wrapper = mountQuasar(Sign)
      wrapper.vm.$nextTick(done)
    })

    test('getRedirectResult has resolved returning no user', async () => {
      return getRedirectResult.mock.results[0].value.then(result => {
        expect(result).toEqual({ user: null })
      })
    })

    it('displays a "SignMethodItem" for email', () => {
      const signMethodItemEmail = wrapper.find('.signMethodItemEmail_test')
      expect(signMethodItemEmail.exists()).toBeTruthy()
    })

    it('displays a "SignMethodItem" for google', () => {
      const signMethodItemGoogle = wrapper.find('.signMethodItemGoogle_test')
      expect(signMethodItemGoogle.exists()).toBeTruthy()
    })

    describe('when "SignMethodItem" for email emits "click"', () => {
      beforeAll(done => {
        const signMethodItem = wrapper.find('.signMethodItemEmail_test')
        signMethodItem.vm.$emit('click')
        wrapper.vm.$nextTick(done)
      })

      it('displays a "SignEmail" component', () => {
        const signEmail = wrapper.find('.signEmail_test')
        expect(signEmail.exists()).toBeTruthy()
      })

      describe('when "SignEmail" emits "email" with value "test@email.com"', () => {
        let resolveSendEmailLink

        beforeAll(done => {
          setSendSignInLinkToEmail(() => {
            return new Promise(resolve => {
              resolveSendEmailLink = resolve
            })
          })

          const signEmail = wrapper.find('.signEmail_test')
          signEmail.vm.$emit('email', testEmail)
          wrapper.vm.$nextTick(done)
        })

        it('displays a "SpinnerWithMessage" component', () => {
          const spinner = wrapper.find('.spinnerWithMessage_test')
          expect(spinner.exists()).toBe(true)
        })

        describe('after "sendSignInLinkToEmail" resolves', () => {
          beforeAll(done => {
            resolveSendEmailLink()
            wrapper.vm.$nextTick(done)
          })

          test('localStorage stores "test@email.com" as "emailForSignIn" item', () => {
            const emailForSignIn = localStorage.getItem('emailForSignIn')
            expect(emailForSignIn).toBe(testEmail)
          })

          it('displays a "SuccessWithMessage" component', () => {
            const success = wrapper.find('.successWithMessage_test')
            expect(success.exists()).toBe(true)
          })

          afterAll(() => {
            localStorage.removeItem('emailForSignIn')
          })
        })
      })
    })
  })
})
