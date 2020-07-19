import { mountQuasar } from '@test'
import UpdateBtn from './UpdateBtn'

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        delegateRouteGuard ({ commit }, { next, action }) {
          commit('setRouteGuard', { next, action })
        }
      },
      getters: {
        routeGuard (state) {
          return state.routeGuard
        }
      },
      mutations: {
        setRouteGuard (state, { action, next }) {
          state.routeGuard = { action, next }
        }
      },
      state () {
        return {
          routeGuard: {
            action: null,
            next: () => {}
          }
        }
      }
    }
  }
}

const data1 = 'data1'
const data2 = 'data2'
const updateFn = jest.fn()
const cancelFn = jest.fn()

let onClickOk
let onClickCancel

const $q = {
  dialog: jest.fn(() => {
    return {
      onOk: callback => {
        onClickOk = callback
        return {
          onCancel: callback => {
            onClickCancel = callback
          }
        }
      }
    }
  })
}

const next = jest.fn()

describe('UpdateBtn', () => {
  const wrapper = mountQuasar(UpdateBtn,
    {
      propsData: {
        oldData: data1,
        newData: data2,
        updateFn,
        cancelFn
      },
      store,
      mocks: {
        $q
      }
    })

  describe('when "oldData" and "newData" are equal', () => {
    beforeAll(async () => {
      wrapper.setProps({
        oldData: data1,
        newData: data1
      })
      await wrapper.vm.$nextTick()
    })

    it('displays nothing', () => {
      expect(wrapper.html()).toBeFalsy()
    })
  })

  describe('when "oldData" and "newData" are different', () => {
    beforeAll(async () => {
      wrapper.setProps({
        oldData: data1,
        newData: data2
      })
      await wrapper.vm.$nextTick()
    })

    describe('when "SaveChangesBtn" emits "click"', () => {
      it('calls "updateFn"', async () => {
        const btn = wrapper.find('.SaveChangesBtn_test')
        btn.vm.$emit('click')
        await wrapper.vm.$nextTick()
        expect(updateFn).toHaveBeenCalled()
        updateFn.mockClear()
      })
    })

    describe('when "CancelChangesBtn" emits "click"', () => {
      it('calls "updateFn"', async () => {
        const btn = wrapper.find('.CancelChangesBtn_test')
        btn.vm.$emit('click')
        await wrapper.vm.$nextTick()
        expect(cancelFn).toHaveBeenCalled()
        cancelFn.mockClear()
      })
    })

    describe('when route changes', () => {
      beforeAll(async () => {
        wrapper.vm.delegateRouteGuard({ action: 'routeUpdate', next })
        await wrapper.vm.$nextTick()
      })

      it('opens a dialog', () => {
        expect($q.dialog).toHaveBeenCalled()
      })

      describe('when user clicks on ok', () => {
        beforeAll(async () => {
          onClickOk()
          await wrapper.vm.$nextTick()
        })

        it('calls "updateFn"', () => {
          expect(updateFn).toHaveBeenCalledWith()
        })

        it('routes to next page', () => {
          expect(next).toHaveBeenCalled()
        })

        it('realeses the routeGuard', () => {
          expect(wrapper.vm.routeGuard.action).toBeFalsy()
        })
      })

      afterAll(jest.clearAllMocks)
    })

    describe('when route changes and user clicks cancel', () => {
      beforeAll(async () => {
        wrapper.vm.delegateRouteGuard({ action: 'routeUpdate', next })
        await wrapper.vm.$nextTick()
        onClickCancel()
        await wrapper.vm.$nextTick()
      })

      it('cancels routing to next page', () => {
        expect(next).toHaveBeenCalledWith(false)
      })

      it('realeses the routeGuard', () => {
        expect(wrapper.vm.routeGuard.action).toBeFalsy()
      })

      afterAll(jest.clearAllMocks)
    })
  })

  describe('when "oldData" and "newData" are equal and route changes', () => {
    beforeAll(async () => {
      wrapper.setProps({
        oldData: data1,
        newData: data1
      })
      await wrapper.vm.$nextTick()
      wrapper.vm.delegateRouteGuard({ action: 'routeUpdate', next })
      await wrapper.vm.$nextTick()
    })

    it('routes to next page', () => {
      expect(next).toHaveBeenCalledWith()
    })

    it('realeses the routeGuard', () => {
      expect(wrapper.vm.routeGuard.action).toBeFalsy()
    })

    afterAll(jest.clearAllMocks)
  })
})
