import { mountQuasar } from '@test'
import Sign from './Sign'
import {
  getRedirectResult,
  restoreFirebaseMock,
  setGetRedirectResult,
  setIsSignInWithFirebaseEmailLink,
  setSendSignInLinkToEmail,
  setSignInWithEmailLink,
  signInWithEmailLink,
  signInWithGoogle
} from '@firebaseAuth'

const testEmail = 'test@email.com'
let okFn
const $q = {
  dialog: jest.fn().mockImplementation(() => {
    return {
      onOk: fn => { okFn = fn }
    }
  })
}

const store = {
  modules: {
    user: {
      namespaced: true,
      actions: {
        initUser: jest.fn()
      }
    }
  }
}

const $router = {
  push: jest.fn()
}

function init () {
  return mountQuasar(Sign, {
    store,
    mocks: {
      $q,
      $router
    }
  })
}

function restore () {
  localStorage.removeItem('emailForSignIn')
  restoreFirebaseMock()
  $q.dialog.mockClear()
  store.modules.user.actions.initUser.mockClear()
}

describe('Sign', () => {
  describe('when accessing from navigation, after getRedirectResult has resolved', () => {
    let wrapper

    beforeAll(done => {
      wrapper = init()
      wrapper.vm.$nextTick(done)
    })

    test('getRedirectResult has resolved returning no user', async () => {
      return getRedirectResult.mock.results[0].value.then(result => {
        expect(result).toEqual({ user: null })
      })
    })

    it('displays a "SignMethodItem" for email', () => {
      const signMethodItemEmail = wrapper.find('.signMethodItemEmail_test')
      expect(signMethodItemEmail.exists()).toBe(true)
    })

    it('displays a "SignMethodItem" for google', () => {
      const signMethodItemGoogle = wrapper.find('.signMethodItemGoogle_test')
      expect(signMethodItemGoogle.exists()).toBe(true)
    })

    describe('when "SignMethodItem" for email emits "click"', () => {
      beforeAll(done => {
        const signMethodItem = wrapper.find('.signMethodItemEmail_test')
        signMethodItem.vm.$emit('click')
        wrapper.vm.$nextTick(done)
      })

      it('displays a "SignEmail" component', () => {
        const signEmail = wrapper.find('.signEmail_test')
        expect(signEmail.exists()).toBe(true)
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
        })
      })

      afterAll(done => {
        wrapper.vm.display('chooseMethod')
        wrapper.vm.$nextTick(done)
      })
    })

    describe('when "SignMethodItem" for google emits "click"', () => {
      beforeAll(done => {
        const signMethodItem = wrapper.find('.signMethodItemGoogle_test')
        signMethodItem.vm.$emit('click')
        wrapper.vm.$nextTick(done)
      })

      it('executes SignInWithGoogle', () => {
        expect(signInWithGoogle).toHaveBeenCalled()
      })
    })

    afterAll(restore)
  })

  describe('when accessing from signInLink and "emailForSignIn" is set in localStorage', () => {
    let wrapper
    let resolveSignIn
    const SignInPromise = new Promise(resolve => {
      resolveSignIn = resolve
    })

    beforeAll(done => {
      localStorage.setItem('emailForSignIn', testEmail)
      setIsSignInWithFirebaseEmailLink(() => true)
      setSignInWithEmailLink(() => SignInPromise)
      wrapper = init()
      wrapper.vm.$nextTick(done)
    })

    it('displays as "SpinnerWithMessage" component', () => {
      const spinner = wrapper.find('.spinnerWithMessage_test')
      expect(spinner.exists()).toBe(true)
    })

    describe('when "signInWithEmailLink" has resolved', () => {
      beforeAll(done => {
        resolveSignIn({ user: { uid: 'userId' } })
        SignInPromise.then(() => {
          wrapper.vm.$nextTick(done)
        })
      })

      test('localStorage has removed "emailForSignIn" item', () => {
        const emailForSignIn = localStorage.getItem('emailForSignIn')
        expect(emailForSignIn).toBeFalsy()
      })

      it('displays a "SuccessWithMessage" component', () => {
        const success = wrapper.find('.successWithMessage_test')
        expect(success.exists()).toBe(true)
      })

      it('initializes the user in the database', () => {
        expect(store.modules.user.actions.initUser).toHaveBeenCalled()
      })
    })

    afterAll(restore)
  })

  describe('when accessing from signInLink and "emailForSignIn" is unset in localStorage', () => {
    let wrapper

    beforeAll(done => {
      localStorage.removeItem('emailForSignIn')
      setIsSignInWithFirebaseEmailLink(() => true)
      setSignInWithEmailLink(jest.fn().mockResolvedValue({ user: { uid: 'userId' } }))
      wrapper = init()
      wrapper.vm.$nextTick(done)
    })

    it('asks the user for his email', () => {
      expect($q.dialog).toHaveBeenCalled()
    })

    describe('when user prompts email', () => {
      beforeAll(() => {
        okFn(testEmail)
      })

      test('executes signInWithEmailLink with the given email', () => {
        expect(signInWithEmailLink).toHaveBeenCalledWith(testEmail)
      })
    })

    afterAll(restore)
  })

  describe('when accessing from third party sign in', () => {
    let wrapper
    let resolveGetRedirectResult
    const getRedirectResultPromise = new Promise(resolve => {
      resolveGetRedirectResult = resolve
    })

    beforeAll(done => {
      setGetRedirectResult(() => getRedirectResultPromise)
      wrapper = init()
      wrapper.vm.$nextTick(done)
    })

    it('displays a "SpinnerWithMessage" component', () => {
      const spinner = wrapper.find('.spinnerWithMessage_test')
      expect(spinner.exists()).toBe(true)
    })

    describe('when getRedirectResult resolves with no null user', () => {
      beforeAll(done => {
        resolveGetRedirectResult({ user: { uid: 'userId' } })
        getRedirectResultPromise.then(() => {
          wrapper.vm.$nextTick(done)
        })
      })

      it('displays a "SuccessWithMessage" component', () => {
        const success = wrapper.find('.successWithMessage_test')
        expect(success.exists()).toBe(true)
      })

      it('routes user to home', () => {
        expect($router.push).toHaveBeenCalledWith({ name: 'home' })
      })
    })

    afterAll(restore)
  })
})
