import { mountQuasar } from '@test'
import StartChase from './StartChase'

describe('StartChase', () => {
  const chaseId = 'testChaseId'
  const store = {
    modules: {
      chase: {
        namespaced: true,
        actions: {
          start: jest.fn()
        },
        state: () => {}
      }
    }
  }
  const wrapper = mountQuasar(StartChase, {
    store,
    mocks: {
      $route: {
        params: {
          chaseId
        }
      }
    }
  })

  describe('when clicking on "start chase" button', () => {
    beforeAll(done => {
      const button = wrapper.findComponent({ name: 'QBtn' })
      button.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('fires "start" method with "chaseId" parameter', () => {
      const start = store.modules.chase.actions.start
      expect(start).toHaveBeenCalledWith(expect.any(Object), { chaseId })
    })
  })
})
